import inquirer from 'inquirer';

import { ModsForUpdate, ParsedModList } from '../types';

export const chooseModsForUpdate = async (
  availableModsForUpdate: ModsForUpdate,
  currentMods: ParsedModList
): Promise<ModsForUpdate> => {
  const promptModsList = availableModsForUpdate.map((availableForUpdateMod) => {
    const { name, availableVersionForUpdate: { version } } = availableForUpdateMod;
    const currentVersion = currentMods.find((currentMod) => currentMod.name === name)?.version;

    if (!currentVersion) {
      throw Error(`The current mods list hasn't got "${name}" mod`);
    }

    return {
      name: `${name} (${currentVersion} -> ${version})`,
      value: availableForUpdateMod,
    };
  });

  const answers = await inquirer.prompt({
    name: 'ModsForUpdate',
    type: 'checkbox',
    message: 'What mods do you want to update?',
    choices: promptModsList,
  });

  return answers.ModsForUpdate;
};
