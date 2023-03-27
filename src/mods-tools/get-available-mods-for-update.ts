import axios from 'axios';
import { compare, compareVersions, satisfies } from 'compare-versions';

import {
  AvailableModsForUpdate,
  ModsReleasesInfoData,
  ParsedModList,
  ProgramOptions,
} from '../types';
import { getSatisfiesModsVersionCondition } from '../utils/get-satisfies-mods-version-condition';
import { modifySatisfiesModsVersionCondition } from '../utils/modify-satisfies-mods-version-conditio';
import { axiosConfigExtender } from '../utils/axios-config-extender';

export const getAvailableModsForUpdate = async (
  options: Pick<ProgramOptions, 'modsUrl' | 'semiVersions' | 'gameVersion'>,
  currentModsList: ParsedModList
) => {
  try {
    const modsReleasesInfo = await axios<ModsReleasesInfoData>(
      axiosConfigExtender({
        url: options.modsUrl,
        method: 'GET',
        params: {
          namelist: currentModsList.map((mod) => mod.name).join(','),
        },
      })
    );

    let satisfiesModsVersionCondition = getSatisfiesModsVersionCondition(
      options.semiVersions
    );

    return modsReleasesInfo.data.results.reduce<AvailableModsForUpdate>(
      (acc, mod) => {
        const installedMod = currentModsList.find(
          (currentMod) => currentMod.name === mod.name
        );

        if (!installedMod) {
          return acc;
        }

        const availableVersionForUpdate = mod?.releases
          .filter((release) => {
            if (options.semiVersions === 'beta') {
              satisfiesModsVersionCondition =
                modifySatisfiesModsVersionCondition(
                  release.version,
                  satisfiesModsVersionCondition
                );
            }

            const isGameVersionSatisfied = satisfies(
              options.gameVersion,
              `^${release.info_json?.factorio_version}`
            );
            const isNewVersionMod = compare(
              release.version,
              installedMod.version,
              '>'
            );
            const isNeedMod = Boolean(satisfiesModsVersionCondition)
              ? satisfies(
                  release.version,
                  `${satisfiesModsVersionCondition}${installedMod.version}`
                )
              : true;

            return isGameVersionSatisfied && isNewVersionMod && isNeedMod;
          })
          .sort((a, b) => compareVersions(a.version, b.version))
          .pop();

        if (availableVersionForUpdate) {
          return [
            ...acc,
            {
              name: mod.name,
              availableVersionForUpdate,
            },
          ];
        }

        return acc;
      },
      []
    );
  } catch (e) {
    console.error('Error during the getting available mods for update!');

    throw e;
  }
};
