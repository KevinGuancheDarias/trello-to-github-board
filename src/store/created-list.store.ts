import { ProgrammingError } from '../errors/programming.error';

/**
 * Represents a Trello List to github id pair
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @interface TrelloListStore
 */
interface TrelloListStore<T extends { id: string }> {
    trelloList: T;
    githubId: number | 'create';
}

/**
 * Stores the Github list that has been created for given Trello Lists
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @class CreatedListStore
 */
export class CreatedListStore<T extends { id: string }> {
    private _map: Map<String, TrelloListStore<T>> = new Map();

    /**
     * Checks if the given trelloId is in the list
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @param {*} trelloId
     * @returns {boolean}
     * @memberof CreatedListStore
     */
    public exists(trelloId): boolean {
        return !!this._map.get(trelloId);
    }

    /**
     * Finds if there is a github list for the given Trello list, else may mean the list is in 'create' state
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @param {string} trelloId
     * @returns {boolean}
     * @memberof CreatedListStore
     */
    public isCreated(trelloId: string): boolean {
        return this._map.get(trelloId) && typeof this._map.get(trelloId).githubId === 'number';
    }

    /**
     * Adds a new relation to the map
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @param {T} trelloId
     * @param {number} githubId
     * @param {boolean} [override=false] If specified will overwrite the existing mapping
     * @memberof CreatedListStore
     */
    public addRelation(trelloList: T, githubId: number | 'create', override = false): void {
        if (!override && this._map.get(trelloList.id)) {
            throw new ProgrammingError(`A github list for ${trelloList.id} trello list already exists`);
        }
        this._map.set(trelloList.id, {
            trelloList,
            githubId,
        });
    }

    /**
     * Updates an entry that has the 'create' state
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @param {string} trelloId
     * @param {number} githubId
     * @throws {ProgrammingError} When: <ul><li>Github Id is already defined</li><li>TrelloId is not in the map</li></ul>
     * @memberof CreatedListStore
     */
    public updateCreate(trelloId: string, githubId: number): void {
        const value: TrelloListStore<T> = this._map.get(trelloId);
        if (value.githubId === 'create') {
            value.githubId = githubId;
            this._map.set(trelloId, value);
        } else if (typeof value === 'number') {
            throw new ProgrammingError(`Trello list with id ${trelloId} already has an existing github id`);
        } else {
            throw new ProgrammingError(`Tried to updateCreate() a trello list with id ${trelloId} that doesn't exists in the store`);
        }
    }

    /**
     * Returns the Trello list with the specified id
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @param {string} trelloId
     * @returns {TrelloList}
     * @memberof CreatedListStore
     */
    public findTrelloList(trelloId: string): T {
        return this._map.get(trelloId).trelloList;
    }

    /**
     * finds github list id for given trello list
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @param {*} trelloId
     * @returns {TrelloListStore}
     * @throws {ProgrammingError} If the list doesn't exists
     * @memberof CreatedListStore
     */
    public findGithubId(trelloId): number {
        const value = this._map.get(trelloId);
        if (!value) {
            throw new ProgrammingError(`Trello list ${trelloId} has not been added to the map`);
        } else {
            const retVal: number = typeof value.githubId === 'number'
                ? value.githubId
                : null;
            if (!retVal) {
                throw new ProgrammingError('You should never try to find a github list, without knowing before id it exists');
            }
            return retVal;
        }
    }
}
