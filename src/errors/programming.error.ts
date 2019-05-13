import { rainbow } from 'colors';

export class ProgrammingError extends Error {
    public static fromUnexpected(condition: string) {
        return new this(
            // tslint:disable-next-line:max-line-length
            rainbow(`An unexpected programming error has been found: "${condition}". You should now open an issue in https://github.com/KevinGuancheDarias/trello-to-github-board`),
        );
    }
}
