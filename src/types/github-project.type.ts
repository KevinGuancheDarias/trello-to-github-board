import { GithubList } from './github-list.type';

/**
 * Represents a github project
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface GithubProject
 */
export interface GithubProject {
    id: number;
    columns: GithubList[];
}
