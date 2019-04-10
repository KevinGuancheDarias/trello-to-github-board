import { WithIdAndName } from './with-id-and-name.type';

/**
 * Represents a row in the checklist
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface TrelloChecklistItemType
 * @extends {WithIdAndName}
 */
export interface TrelloChecklistItemType extends WithIdAndName {

    /**
     * Position in the list
     *
     * @type {number}
     * @memberof TrelloChecklistItemType
     */
    pos: number;

    idChecklist: string;
    state: 'complete' | 'incomplete';
}
