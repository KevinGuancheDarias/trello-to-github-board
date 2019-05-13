import { GithubIssue } from './github-issue.type';
import { TrelloList } from './trello-list.type';

/**
 * Represents the github data before importing it to github
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface GithubImport
 */
export interface GithubImport {
    issues: GithubIssue[];

    /**
     * When the import has 'create' as trello list, it's required that it has the Trello lists saved,
     * so the system is able to use the same name
     *
     * @type {TrelloList[]}
     * @memberof GithubImport
     */
    trelloLists?: TrelloList[];
}
