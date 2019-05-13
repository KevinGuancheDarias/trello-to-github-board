
/**
 * When the map file is not correct
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @class InvalidMapError
 * @extends {Error}
 */
export class InvalidMapError extends Error {

    /**
     * Creates an instance from a missing list
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @static
     * @param {string|number} id
     * @returns {InvalidMapError}
     * @memberof InvalidMapError
     */
    public static fromMissingList(id: string | number): InvalidMapError {
        return this._fromMissingItem(id, 'list');
    }
    private static _fromMissingItem(id: string | number, type: string): InvalidMapError {
        throw new this(`The Github ${type} with id ${id} doesn't exists in the target repository`);
    }
}
