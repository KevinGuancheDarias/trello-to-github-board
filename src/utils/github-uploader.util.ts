import * as Octokit from '@octokit/rest';
import { question } from 'readline-sync';
import { parse, UrlWithStringQuery } from 'url';
import { GithubImport } from '../types/github-import.type';
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
        this._initOctokit(this._findBaseUrl(urlData.host));
        const [owner, repo] = urlData.pathname.split('/').splice(1);
        await Promise.all(githubImport.issues.map(async current => {
            const created = await this._octokit.issues.create({
                owner,
                repo,
                title: current.name,
            });
            current.id = created.data.id.toString();
        }));
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

    private constructor() {

    }
}
