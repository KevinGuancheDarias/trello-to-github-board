import { WithIdAndName } from './with-id-and-name.type';

/**
 * Represents a Trello card as shown in the project board
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface TrelloCard
 */
export interface TrelloCard extends WithIdAndName {

    /**
     * Represents the position in the Trello board
     *
     * @type {number}
     * @memberof TrelloCard
     */
    pos: number;

    /**
     * Represents the body
     *
     * @type {string}
     * @memberof TrelloCard
     */
    desc: string;

    shortLink: string;
    idList: string;
    idLabels: string[];
    idCheckLists: string[];
    idMembers: string[];
}
