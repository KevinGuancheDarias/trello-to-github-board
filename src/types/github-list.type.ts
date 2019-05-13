/**
 * Represents a github list
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface GithubList
 * @extends {WithIdAndName}
 */
export interface GithubList {
    id?: number | 'create';
    name?: string;
    trelloListId?: string;
}
