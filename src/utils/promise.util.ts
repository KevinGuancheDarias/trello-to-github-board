export class PromiseUtil {

    /**
     * Runs actions delayed (required for github API)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @static
     * @param {number} delay
     * @param {...Array<{ (): Promise<any>; }>} actions
     * @returns {Promise<any>}
     * @memberof PromiseUtil
     */
    public static async runDelayed(delay: number, actions: Array<{ (): Promise<any>; }>): Promise<any> {
        const result: any[] = [];
        for (const action of actions) {
            result.push(await this._runSingleDelayed(action, delay));
        }
        if (actions.length > 1) {
            return result;
        } else {
            return result[0];
        }
    }

    private static _runSingleDelayed<T>(action: () => Promise<T>, delay = 1000): Promise<T> {
        return new Promise(resolve => setTimeout(() => {
            action().then(data => resolve(data));
        }, delay,
        ));
    }

    private constructor() {

    }
}
