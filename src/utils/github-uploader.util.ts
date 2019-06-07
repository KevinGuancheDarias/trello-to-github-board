import * as Octokit from '@octokit/rest';
import { blue } from 'colors';
import { question } from 'readline-sync';
import { parse, UrlWithStringQuery } from 'url';
import { InvalidInputArgumentError } from '../errors/invalid-input-argument.error';
import { CreatedListStore } from '../store/created-list.store';
import { GithubCreatedList } from '../types/github-created-list.type';
import { GithubImport } from '../types/github-import.type';
import { GithubProject } from '../types/github-project.type';
import { TrelloList } from '../types/trello-list.type';
import { PromiseUtil } from './promise.util';
import { TrelloGithubMapperUtil } from './trello-github-mapper.util';

/**
 * This class provides the required functionality to upload the import object to a repository project
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @class GithubUploaderUtil
 */
export class GithubUploaderUtil {

    private static _octokit: Octokit;
    private static _createdListStore: CreatedListStore<TrelloList>;

    /**
     * Uploads the issues to the target repository
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @static
     * @param {GithubImport} githubImport
     * @param {string} url
     * @returns {Promise<void>}
     * @memberof GithubUploaderUtil
     */
    public static async uploadIssues(githubImport: GithubImport, url: string): Promise<void> {
        const urlData: UrlWithStringQuery = parse(url);
        this._initStore(githubImport);
        this._initOctokit(this._findBaseUrl(urlData.host));
        const [owner, repo] = urlData.pathname.split('/').splice(1);
        const githubProject: GithubProject = await this._findProject(url);
        await TrelloGithubMapperUtil.verifyMap({ githubImport, githubProject });
        await PromiseUtil.runDelayed(1000, githubImport.issues.map(current => async () => {
            const created = await this._octokit.issues.create({
                owner,
                repo,
                title: current.name,
            });
            current.id = created.data.id.toString();
            await this._octokit.issues.addLabels({
                issue_number: created.data.number,
                labels: current.labels,
                owner,
                repo,
            });
        }));
        console.log(blue('Associating Github issues and Github board lists/columns'));
        await this._assocIssuesAndLists(githubImport, githubProject);
    }

    private static async _assocIssuesAndLists(githubImport: GithubImport, project: GithubProject): Promise<void> {
        await PromiseUtil.runDelayed(1000,
            githubImport.issues.filter(issue => issue.list && issue.list.id && issue.id).map(issue => async () => {
                await this._octokit.projects.createCard({
                    column_id: await this._resolveListId(project, issue.list.trelloListId, issue.list.id),
                    content_id: +issue.id,
                    content_type: 'Issue',
                });
            }),
        );
    }

    private static _initOctokit(baseUrl: string): void {
        if (process.env.GIT_TOKEN) {
            this._octokit = new Octokit({
                auth: `token ${process.env.GIT_TOKEN}`,
                baseUrl,
            });
        } else {
            const gitUsername: string = process.env.GIT_USERNAME
                ? process.env.GIT_USERNAME
                : question('Enter git username: ');
            const gitPassword: string = process.env.GIT_PASSWORD
                ? process.env.GIT_PASSWORD
                : question('Enter git password: ', { hideEchoBack: true });
            this._octokit = new Octokit({
                auth: {
                    async on2fa() {
                        return question('Enter received 2FA token: ');
                    },
                    password: gitPassword,
                    username: gitUsername,
                },
                baseUrl,
            });
        }
    }

    private static _initStore(githubImport: GithubImport): void {
        this._createdListStore = new CreatedListStore();
        githubImport.trelloLists.forEach(list => {
            this._createdListStore.addRelation(list, 'create');
        });

    }
    private static _findBaseUrl(domain: string): string {
        let retVal: string;
        if (domain === 'github.com') {
            retVal = 'https://api.github.com';
        } else if (process.env.GIT_BASE_URL) {
            retVal = process.env.GIT_BASE_URL;
        } else {
            retVal = question('Insert Github API base url: ');
        }
        return retVal;
    }

    private static async _findProject(url: string): Promise<GithubProject> {
        const [owner, repo, projectsKey, projectId] = url.split('/').splice(3);
        if (projectsKey !== 'projects' || !projectId || isNaN(+projectId)) {
            throw new InvalidInputArgumentError(`The specified project url is not valid`);
        }
        const expectedProject = (await this._octokit.projects.listForRepo({
            owner,
            repo,
        })).data.find(project => project.html_url === url);
        if (!expectedProject) {
            throw new InvalidInputArgumentError(`Project ${url} doesn't exists`);
        }
        return {
            columns: (await this._octokit.projects.listColumns({
                project_id: expectedProject.id,
            })).data,
            id: expectedProject.id,
        };
    }

    private static async _resolveListId(project: GithubProject, trelloListId: string, githubId: number | 'create'): Promise<number> {
        if (typeof githubId === 'number') {
            return githubId;
        } else if (this._createdListStore.exists(trelloListId) && this._createdListStore.isCreated(trelloListId)) {
            return this._createdListStore.findGithubId(trelloListId);
        } else {
            const trelloList: TrelloList = this._createdListStore.findTrelloList(trelloListId);
            console.log(`Creating list ${trelloList.name}`);
            const githubList: GithubCreatedList = (await this._octokit.projects.createColumn({
                name: trelloList.name,
                project_id: project.id,
            })).data;
            this._createdListStore.addRelation(trelloList, githubList.id, true);
            console.log(`Success creating list ${trelloList.name} with new github id ${githubList.id} `);
            return githubList.id;
        }
    }

    private constructor() {

    }
}
