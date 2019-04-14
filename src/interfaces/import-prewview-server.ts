import { GithubImport } from '../types/github-import.type';

export type validEvents = 'start' | 'done';

/**
 * Implementers will allow to display a preview of the import operation
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @interface ImportPreviewServer
 */
export interface ImportPreviewServer {
    setData(data: GithubImport);

    /**
     * Starts the server
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @export
     */
    start(): Promise<void>;

    /**
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @export
     */
    stop(): Promise<void>;

    /**
     * Returns a promise that solves when the user has confirmed the import
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @export
     */
    waitForConfirmation(): Promise<boolean>;

    /**
     * Displays the result (for example in HTTP would open the user default web browser)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @export
     */
    show(): void;

    /**
     * Subscribes to server events
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @export
     */
    on(event: validEvents, action: () => Promise<void>): this;
}
