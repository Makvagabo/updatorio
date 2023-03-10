import { Config, Options } from "./types";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

let config: Config;

export const initConfig = () => {
  if (config) {
    return;
  }

  const defaultOptions: Options = {
    modsUrl: "https://mods.factorio.com/api/mods",
    downloadModsUrl: "https://mods.factorio.com",
    authUrl: "https://auth.factorio.com/api-login",
    semiVersions: "minor",
    serverDir: "./",
  };
  const packageInfo = JSON.parse(
    fs.readFileSync(path.resolve("./package.json")).toString()
  );
  const factorioServerBinFile = path.join(
    defaultOptions.serverDir,
    "bin/x64/factorio"
  );

  const [factorioVersion] =
    execSync(`${factorioServerBinFile} --version`)
      .toString()
      .split("\n")[0]
      .match(/\d+\.\d+\.\d+/) || [];

  defaultOptions.gameVersion = factorioVersion || "1.0";

  config = {
    version: packageInfo.version,
    gameServiceAddress: "factorio.com",
    defaultOptions,
  };
};

export const getConfig = () => config;
