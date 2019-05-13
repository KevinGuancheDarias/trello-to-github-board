import { GithubImport } from '../types/github-import.type';
import { GithubIssue } from '../types/github-issue.type';
import { TrelloExport } from '../types/trello-export.type';
import { TrelloList } from '../types/trello-list.type';

/**
 * Parses the input Trello JSON and returns a valid GithubImport object
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @class TrelloParser
 */
export class TrelloParserUtil {

    /**
     * Parses the input JSON
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @static
     * @param {TrelloExport} trelloExport
     * @param {any} _ In this future this argument will be the specified mapfile
     * @returns {Promise<GithubImport>}
     * @memberof TrelloParserUtil
     */
    public static async parseJson(trelloExport: TrelloExport, _: any): Promise<GithubImport> {
        return {
            issues: trelloExport.cards.map<GithubIssue>(card => {
                return {
                    checkLists: [],
                    labels: [],
                    members: [],
                    name: card.name,
                    trelloCardId: card.id,
                };
            }),
        };
    }

    /**
     * Finds a Trello list by Id
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @static
     * @param {TrelloExport} trelloExport
     * @param {string} id
     * @returns {TrelloList}
     * @memberof TrelloParserUtil
     */
    public static findListById(trelloExport: TrelloExport, id: string): TrelloList {
        return trelloExport.lists.find(list => list.id === id);
    }

    private constructor() { }
}
