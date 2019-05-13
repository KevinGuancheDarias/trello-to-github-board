import { yellow } from 'colors';
import { InvalidMapError } from '../errors/invalid-map.error';
import { CreatedListStore } from '../store/created-list.store';
import { GithubImport } from '../types/github-import.type';
import { GithubList } from '../types/github-list.type';
import { GithubProject } from '../types/github-project.type';
import { TrelloCard } from '../types/trello-card.type';
import { TrelloExport } from '../types/trello-export.type';
import { TrelloGithubMap } from '../types/trello-github-map.type';
import { TrelloList } from '../types/trello-list.type';
import { TrelloParserUtil } from './trello-parser.util';

/**
 * Applies map to githubImport files
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @class TrelloGithubMapperUtil
 */
export class TrelloGithubMapperUtil {
    public static async applyMap(input: { trello: TrelloExport, github: GithubImport }, mapData: TrelloGithubMap): Promise<GithubImport> {
        const map: CreatedListStore = new CreatedListStore();
        input.github.trelloLists = input.github.trelloLists instanceof Array
            ? input.github.trelloLists
            : [];
        await Promise.all(input.github.issues.map(async issue => {
            const trelloCard: TrelloCard = this._findTrelloCardById(issue.trelloCardId, input.trello);
            const githubListId: number | 'create' = this._findListInMap(trelloCard.idList, input.trello, mapData);
            if (githubListId) {
                issue.list = {
                    id: githubListId,
                    trelloListId: trelloCard.idList,
                };
                if (githubListId === 'create' && !map.exists(trelloCard.idList)) {
                    const trelloList: TrelloList = TrelloParserUtil.findListById(input.trello, issue.list.trelloListId);
                    map.addRelation(trelloList, githubListId);
                    input.github.trelloLists.push(trelloList);
                }
            }
        }));
        return input.github;
    }

    public static async verifyMap(
        { githubProject, githubImport }: { githubProject: GithubProject; githubImport: GithubImport; },
    ): Promise<void> {
        const listsMap: Map<number, GithubList> = new Map();
        githubProject.columns.forEach(column => typeof column.id === 'number' && listsMap.set(column.id, column));
        githubImport.issues.forEach(issue => {
            if (issue.list && typeof issue.list.id === 'number' && !listsMap.get(issue.list.id)) {
                throw InvalidMapError.fromMissingList(issue.list.id);
            }
        });
    }

    private static _findTrelloCardById(search: string, trello: TrelloExport): TrelloCard {
        return trello.cards.find(card => card.id === search);
    }

    private static _findListInMap(listId: string, trello: TrelloExport, mapData: TrelloGithubMap): number | 'create' {
        if (!mapData.lists && !mapData.notFoundList) {
            throw new InvalidMapError('The specified mapfile doesn\'t contain lists nor default lists');

        } else if (mapData.notFoundList) {
            return mapData.notFoundList.github_id;
        } else {
            const byIdMap = mapData.lists.find(list => list.trello_id === listId);
            if (byIdMap && byIdMap.github_id) {
                return byIdMap.github_id;
            } else {
                const trelloList: TrelloList = trello.lists.find(list => list.id === listId);
                if (trelloList) {
                    const byNameMap = mapData.lists.find(list => list.trello_name === trelloList.name);
                    if (byNameMap && byNameMap.github_id) {
                        return byNameMap.github_id;
                    } else if (mapData.notFoundList) {
                        return mapData.notFoundList.github_id;
                    } else {
                        console.warn(yellow(
                            // tslint:disable-next-line:max-line-length
                            `Warning: Trello list with id ${listId} and with name ${trelloList.name} is not in the map file, will not assign the issue to any list`,
                        ));
                    }
                } else {
                    console.warn(yellow(
                        // tslint:disable-next-line:max-line-length
                        `Warning: Unexpected situation, trello card is associated with list ${listId}, but no such list exists. Has the JSON been modified by hand?`,
                    ));
                }
            }
        }
    }

    private constructor() {

    }
}
