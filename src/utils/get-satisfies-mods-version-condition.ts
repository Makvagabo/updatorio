import { ProgramOptions } from "../types";

export const getSatisfiesModsVersionCondition = (
  versions?: ProgramOptions["semiVersions"]
) => {
  switch (versions) {
    case "minor":
      return "^";
    case "patch":
      return "~";
    default:
      return "";
  }
};
