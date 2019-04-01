import { WithIdAndName } from './with-id-and-name.type';


/**
 * Represents a Trello label description
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface TrelloLabel
 * @extends {WithIdAndName}
 */
export interface TrelloLabel extends WithIdAndName {
    color: string,
}