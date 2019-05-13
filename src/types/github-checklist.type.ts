
/**
 * Represents a Checklist, Github representation doesn't have the concept of "Checklist AND Checklist item"
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface GithubChecklistItem
 */
export interface GithubChecklistItem {
    name: string;
    isCompleted: boolean;
    trelloChecklistId?: string;
}
