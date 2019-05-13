
/**
 * Represents the map file
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface TrelloGithubMap
 */
export interface TrelloGithubMap {
    lists: Array<{
        github_id?: number | 'create';
        trello_id?: string;
        trello_name?: string;
    }>;
    notFoundList: {
        github_id: number | 'create',
    };
}
