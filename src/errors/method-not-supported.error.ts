
/**
 * Thrown when an specified method defined in an interface is not supported by the implementer class
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @class MethodNotSupportedError
 * @extends {Error}
 */
export class MethodNotSupportedError extends Error {
    public static fromClassMethod(objectInstance: object, method: string): MethodNotSupportedError {
        return new this(`Method ${method} is not supported by class ${objectInstance.constructor.name}`);
    }
}
