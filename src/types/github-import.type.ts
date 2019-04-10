import { GithubIssue } from './github-issue.type';

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
}
