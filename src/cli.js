import arg from 'arg';
import inquirer from 'inquirer';

import { createProject } from './main.js';

// interface argObj {
//     skipPrompts: boolean;
//     git: boolean;
//     path: string | false;
//     template?: string;
//     runInstall: boolean;
// }

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '--path': String,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install',
            '-p': 'path',
        },
        {
            argv: rawArgs.slice(2),
        },
    );
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        path: args['--path'] || false,
        template: args._[0],
        runInstall: args['--install'] || false,
    };
}

async function promptForMissingOptions(options) {
    const defaultTemplate = 'JavaScript';

    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || defaultTemplate,
        };
    }

    const questions = [];

    if (!options.template) {
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Please choose which project template to use',
            choices: ['JavaScript', 'TypeScript'],
            default: defaultTemplate,
        });
    }

    if (!options.git) {
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'Initialize a git repository?',
            default: false,
        });
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git,
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    console.log(options);
    await createProject(options);
}
