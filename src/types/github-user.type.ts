
/**
 * Represents a Github User
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface GithubUser
 */
export interface GithubUser {
    username: string;

    /**
     * A boolean indicating if the user exists or not, if undefined then it means the check is disabled
     *
     * @type {boolean}
     * @memberof GithubUser
     */
    exists?: boolean;
}
