import axios from 'axios';
import { AvailableModsForUpdate, ModsReleasesInfoData, ParsedModList, ProgramOptions } from '../types';
import { compare, compareVersions, satisfies } from 'compare-versions';
import { getSatisfiesModsVersionCondition } from '../utils/get-satisfies-mods-version-condition';

export const getAvailableModsForUpdate = async (options: Pick<ProgramOptions, 'modsUrl' | 'semiVersions' | 'gameVersion'>, currentModsList: ParsedModList) => {
  try {
    const modsReleasesInfo = await axios<ModsReleasesInfoData>({
      url: options.modsUrl,
      method: "GET",
      params: {
        namelist: currentModsList.map((mod) => mod.name).join(","),
      },
    });

    const satisfiesModsVersionCondition = getSatisfiesModsVersionCondition(options.semiVersions);

    return modsReleasesInfo.data.results.reduce<AvailableModsForUpdate>((acc, mod) => {
      const installedMod = currentModsList.find(
        (currentMod) => currentMod.name === mod.name
      );

      if (!installedMod) {
        return acc;
      }

      const availableVersionForUpdate = mod?.releases
        .filter((release) => {
          const isGameVersionSatisfied = satisfies(
            options.gameVersion,
            `^${release.info_json?.factorio_version}`
          );
          const isNewVersionMod = compare(
            release.version,
            installedMod.version,
            ">"
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
    }, []);
  } catch (e) {
    console.error('Error during the getting available mods for update!', e);

    return [];
  }
};
