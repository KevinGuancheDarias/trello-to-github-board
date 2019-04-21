import { blue, green, red } from 'colors';
import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { FileNotFound } from './errors/file-not-found.error';
import { GithubImport } from './types/github-import.type';
import { GithubUploaderUtil } from './utils/github-uploader.util';
import { TrelloParserUtil } from './utils/trello-parser.util';
const program = new Command();

const readingOptions = { encoding: 'utf-8' };

process.on('unhandledRejection', (error: any) => {
    if (error && error instanceof Error) {
        console.error(red(`FATAL: Error of type ${error.constructor.name} occured, message: ${error.message}`));
        console.log(error);
    } else {
        console.error(red(`Unknown unhandled error ${error}`));
    }
});

// tslint:disable-next-line:no-var-requires
program.version(require('../package').version, '-v --version');

program.option('-h, --help', 'Displays help', () => {
    program.help();
});

program
    .command('parse <trelloFile>')
    .option('-m, --map-file <mapFile>', 'How to map users and lists [map.json]', 'map.json')
    .option('-o, --output-file <outputFile>', 'Where to save the github-import file, if not specified will be output.json', 'output.json')
    .action(async (trelloFile: string, command: Command) => {
        try {
            const mapFile: string = command.mapFile;
            const outputFile: string = command.outputFile;
            if (!existsSync(trelloFile)) {
                throw FileNotFound.fromFile(trelloFile);
            }
            if (mapFile && !existsSync(mapFile)) {
                throw FileNotFound.fromFile(mapFile);
            }
            const mapFileData = JSON.parse(readFileSync(mapFile, readingOptions));
            const importData: GithubImport = await TrelloParserUtil.parseJson(readFileSync(trelloFile, readingOptions), mapFileData);
            console.log(blue(`Writing output to file ${outputFile}`));
            writeFileSync(outputFile, JSON.stringify(importData, null, 4));
        } catch (e) {
            console.error(red(`FATAL: Error of type ${e.constructor.name} occured, message: ${e.message}`));
            process.exit(1);
        }
    });

program
    .command('import <githubFile> <githubRepositoryUrl')
    .action(async (githubFile: string, githubRepositoryUrl: string) => {
        if (!existsSync(githubFile)) {
            throw FileNotFound.fromFile((githubFile));
        }
        const fileData: GithubImport = JSON.parse(readFileSync(githubFile, readingOptions));
        console.log(blue(`Uploading the issues to ${githubRepositoryUrl}`));
        await GithubUploaderUtil.uploadIssues(fileData, githubRepositoryUrl);
        console.log(green('Success!'));
    });
// error on unknown commands
program.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});
program.parse(process.argv);
