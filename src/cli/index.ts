import { Command, ParseOptions } from 'commander';
import { validate } from 'compare-versions';

import { getConfig } from '../config';
import { ProgramOptions } from '../types';

let program: Command;

export const run = (argv?: readonly string[], options?: ParseOptions) => {
  const config = getConfig();
  const { defaultOptions } = config;

  program = new Command();

  program
    .name('factorio-mods-updater')
    .description(
      `CLI for updating factorio mods. It updates mods for the linux game server and uses ${config.gameServiceAddress} API.`
    )
    .version(config.version)
    .option(
      '--game-version <value>',
      'server game version',
      (value) => (validate(value) ? value : defaultOptions.gameVersion),
      defaultOptions.gameVersion
    )
    .option(
      '--mods-url <value>',
      `url for getting mod's list`,
      defaultOptions.modsUrl
    )
    .option(
      '--download-mods-url <value>',
      `server mods url`,
      defaultOptions.downloadModsUrl
    )
    .option(
      '--auth-url <value>',
      'url for getting authorization token',
      defaultOptions.authUrl
    )
    .option(
      '--semi-versions <value>',
      'mods semi version for updating',
      defaultOptions.semiVersions
    )
    .option(
      '-i, --interactive',
      'the mode that is allowed you to select what mods you want to update'
    )
    .option(
      '--no-backup [boolean]',
      'not to do a backup of all mods before update',
    )
    .option(
      '--server-dir <value>',
      'root server directory',
      defaultOptions.serverDir
    )
    .requiredOption(
      '--username <value>',
      `your username of the ${config.gameServiceAddress} profile`
    )
    .requiredOption(
      '--password <value>',
      `your password of the ${config.gameServiceAddress} profile`
    );

  program.parse(argv, options);
};
export const getOptions = () => program.opts<ProgramOptions>();
