
/**
 * Thrown when the specified folder or file doesn't exists
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @class FileNotFound
 * @extends {Error}
 */
export class FileNotFound extends Error {
    public static fromFile(file: string): FileNotFound {
        return new this(`File: ${file} not found. No such file or directory`);
    }
}
