import { WithIdAndName } from './with-id-and-name.type';

/**
 * Represents a Trello Checklist
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface TrelloChecklist
 */
export interface TrelloChecklist extends WithIdAndName {
    idCard: string;
}
