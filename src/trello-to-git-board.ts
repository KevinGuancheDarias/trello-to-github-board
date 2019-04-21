import { blue, red } from 'colors';
import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { FileNotFound } from './errors/file-not-found.error';
import { TrelloParserUtil } from './utils/trello-parser';
const program = new Command();

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
            const readingOptions = { encoding: 'utf-8' };
            const mapFileData = JSON.parse(readFileSync(mapFile, readingOptions));
            const importData = await TrelloParserUtil.parseJson(readFileSync(trelloFile, readingOptions), mapFileData);
            console.log(blue(`Writing output to file ${outputFile}`));
            writeFileSync(outputFile, JSON.stringify(importData, null, 4));
        } catch (e) {
            console.error(red(`FATAL: Error of type ${e.constructor.name} occured, message: ${e.message}`));
            process.exit(1);
        }
    });

// error on unknown commands
program.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});
program.parse(process.argv);
