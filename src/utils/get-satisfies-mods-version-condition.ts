import { ProgramOptions } from "../types";

export const getSatisfiesModsVersionCondition = (
  versions?: ProgramOptions["semiVersions"]
) => {
  switch (versions) {
    case "minor":
      return "^";
    case "path":
      return "~";
    default:
      return "";
  }
};
