import { GithubChecklistItem } from './github-checklist.type';
import { GithubList } from './github-list.type';
import { GithubUser } from './github-user.type';

export interface GithubIssue {

    /**
     * Undefined when it's not imported yet
     *
     * @type {string}
     * @memberof GithubIssue
     */
    id?: string;

    trelloCardId?: string;
    name: string;
    members: GithubUser[];
    labels: string[];
    checkLists: GithubChecklistItem[];
    list?: GithubList;
}
