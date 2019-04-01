import { WithIdAndName } from './with-id-and-name.type';


/**
 * Represents a Trello List
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface TrelloList
 * @extends {WithIdAndName}
 */
export interface TrelloList extends WithIdAndName {
    closed: boolean;
}
