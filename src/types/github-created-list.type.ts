/**
 * Represents a github list that has already been created
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface GithubCreatedList
 * @extends {WithIdAndName}
 */
export interface GithubCreatedList {
    id: number;
    name: string;
    trelloListId?: string;
}
