import { GithubImport } from '../types/github-import.type';
import { GithubIssue } from '../types/github-issue.type';
import { TrelloExport } from '../types/trello-export.type';

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
    public static async parseJson(trelloExportJson: string, _: any): Promise<GithubImport> {
        const trelloExport: TrelloExport = JSON.parse(trelloExportJson);
        return {
            issues: trelloExport.cards.map<GithubIssue>(card => {
                return {
                    checkLists: [],
                    labels: [],
                    members: [],
                    name: card.name,
                };
            }),
        };
    }

    private constructor() { }
}
