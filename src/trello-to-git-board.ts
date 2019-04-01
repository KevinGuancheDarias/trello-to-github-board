import { Command } from 'commander';
import { existsSync, readSync, readFileSync } from 'fs';
import { FileNotFound } from './errors/file-not-found';
const program = new Command();

program.version(require('../package').version, '-v --version');

program.option('-h, --help', 'Displays help', () => {
    program.help();
});

program
    .option('-m, --map-file <file>', 'How to map users and lists [map.json]', 'map.json')
    .action(async (trelloFileOrUrl: string, githubProjectRepositoryUrl: string) => {
        try {
            if (!existsSync(program.mapFile)) {
                throw FileNotFound.fromFile(program.mapFile);
            }
            const fileContent = JSON.parse(readFileSync(program.mapFile, { encoding: 'utf-8' }));
        } catch (e) {
            console.error(`FATAL: Error of type ${e.constructor.name} occured, message: ${e.message}`)
            process.exit(1);
        }
    });

// error on unknown commands
program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});
program.parse(process.argv);

