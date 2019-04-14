import { MethodNotSupportedError } from '../errors/method-not-supported.error';
import { ImportPreviewServer, validEvents } from '../interfaces/import-prewview-server';
import { GithubImport } from '../types/github-import.type';

/**
 * Implements the basic methods, whose implementation may not change
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 * @export
 * @abstract
 * @class AbstractImportPreviewServer
 * @implements {ImportPreviewServer}
 */
export abstract class AbstractImportPreviewServer implements ImportPreviewServer {
    protected _data: GithubImport;
    private _eventsHandler: { [key: string]: Function } = {};
    private _confirmationPromise: Promise<boolean>;
    private _resolveFunction: (result: boolean) => void;

    public constructor() {
        this._createPromise();
    }

    public abstract start(): Promise<void>;
    public abstract show(): void;

    /**
     * Defines the data to use
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @param {GithubImport} data
     * @memberof AbstractImportPreviewServer
     */
    public setData(data: GithubImport): void {
        this._data = data;
    }

    /**
     * Registers an event handler
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @param {validEvents} event
     * @param {() => Promise<void>} action
     * @memberof AbstractImportPreviewServer
     */
    public on(event: validEvents, action: () => Promise<void>): this {
        this._eventsHandler[event] = action;
        return this;
    }

    /**
     * This method executes when the invoker wants to stop the server <br>
     * <b>NOTICE: </b> Implementing this method is optional, as caller may not invoke it
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @returns {Promise<void>}
     * @memberof AbstractImportPreviewServer
     */
    public async stop(): Promise<void> {
        throw MethodNotSupportedError.fromClassMethod(this, 'stop');
    }

    /**
     * Returns a promise that solves when the user has confirmed the import
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @returns {Promise<boolean>}
     * @memberof AbstractImportPreviewServer
     */
    public waitForConfirmation(): Promise<boolean> {
        return this._confirmationPromise;
    }

    /**
     * Emits an event, and waits for handler to resolve
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @protected
     * @param {validEvents} event
     * @param {*} data
     * @returns {Promise<any>} The data returned from the handler (may be useful... or may not)
     * @memberof AbstractImportPreviewServer
     */
    protected async _emit(event: validEvents, data: any): Promise<any> {
        if (typeof this._eventsHandler[event] === 'function') {
            return await this._eventsHandler[event]();
        }
    }

    /**
     * When invoked resolves the specified promise
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @protected
     * @param {boolean} result
     * @memberof AbstractImportPreviewServer
     */
    protected _resolveConfirmation(result: boolean): void {
        this._resolveFunction(result);
        this._createPromise();
    }

    private _createPromise(): void {
        this._confirmationPromise = new Promise(resolve => this._resolveFunction = resolve);
    }
}
