import { GithubChecklistItem } from './github-checklist.type';
import { GithubUser } from './github-user.type';
import { TrelloLabel as GithubLabel } from './trello-label.type';

export interface GithubIssue {

    /**
     * Undefined when it's not imported yet
     *
     * @type {string}
     * @memberof GithubIssue
     */
    id?: string;

    name: string;
    members: GithubUser[];
    labels: GithubLabel[];
    checkLists: GithubChecklistItem[];
}
