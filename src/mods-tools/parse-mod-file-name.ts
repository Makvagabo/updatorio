import path from 'path';
import { validate } from 'compare-versions';

import { MOD_EXTENSION, MOD_VERSION_SEPARATOR } from '../constants';

export const parseModFileName = (modPath: string) => {
  const baseName = path.basename(modPath, MOD_EXTENSION);

  if (!baseName.includes(MOD_VERSION_SEPARATOR)) {
    return {
      name: baseName,
      version: 'invalid',
    };
  }

  let sliceVersionIndex = baseName.length;
  let currentChar: string;
  let sliceNameIndex = 0;

  do {
    sliceNameIndex--;
    sliceVersionIndex--;
  } while (
    (currentChar = baseName[sliceVersionIndex]) !== MOD_VERSION_SEPARATOR &&
    sliceVersionIndex >= 0
  );

  const name = baseName.slice(0, sliceNameIndex);
  const version = baseName.slice(sliceVersionIndex + 1);

  if (!validate(version)) {
    return {
      name,
      version: 'invalid',
    };
  }

  return {
    name,
    version,
  };
};
