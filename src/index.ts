import fs from "fs";
import { program } from "commander";
import { compare, compareVersions, satisfies } from "compare-versions";
import axios from "axios";
import JSZip from "jszip";
import { execSync } from "child_process";
import path from "path";

import mods200 from "./__mocks__/mods.json";

const gameServiceAddress = "factorio.com";

const config = {
  modsURL: "https://mods.factorio.com/api/mods",
  authURL: "https://auth.factorio.com/api-login",
  simiVersions: ["path", "minor", "major"],
};

program
  .name("factorio-mods-updater")
  .description(
    `CLI for updating factorio mods. It updates mods for the linux game server and uses ${gameServiceAddress} API.`
  )
  .version("1.0.0")
  .option("--mods-url", `url for getting mod's list`, config.modsURL)
  .option("--auth-url", "url for getting authorization token", config.authURL)
  .option("--username", `your username of the ${gameServiceAddress} profile`)
  .option("--password", `your password of the ${gameServiceAddress} profile`)
  .option(
    "--semi-versions",
    "mods semi version for updating",
    config.simiVersions
  )
  .action((str, options) => {
    console.log({ str, options });
  });

program.parse();

// const credentials = {
//   username: "",
//   password: "",
//   // token: '',
// };
//
// const serverDir = "factorio-modded/serverfiles";
//
// // const factorioServerBinFile = path.join(serverDir, 'bin/x64/factorio');
// const factorioServerBinFile = path.join("mocks", "factorio");
// const [factorioVersion] = execSync(`${factorioServerBinFile} --version`)
//   .toString()
//   .split("\n")[0]
//   .match(/\d+\.\d+\.\d+/);
//
// // const modsDir = 'factorio-modded/serverfiles/mods';
// const modsDir = "mocks";
// const modsFileList = "mod-list.json";
//
// const modsExcludes = ["base"];
// const { mods } = JSON.parse(
//   fs.readFileSync(path.join(modsDir, modsFileList)).toString()
// );
//
// const modsDirFiles = fs.readdirSync(path.join(modsDir, "/"));
// const currentModsList = mods
//   .map(({ name }) => name)
//   .filter((name) => !modsExcludes.includes(name))
//   .reduce((acc, ModName) => {
//     const currentModVersion = path
//       .parse(modsDirFiles.find((fileName) => fileName.includes(ModName)))
//       .name.split("_")
//       .pop();
//
//     if (currentModVersion) {
//       return [
//         ...acc,
//         {
//           name: ModName,
//           version: currentModVersion,
//         },
//       ];
//     }
//   }, []);
//
// const modsApiConfig = {
//   baseURL: serverUrl,
//   url: modsApi,
//   method: "GET",
//   params: {
//     namelist: currentModsList.map((mod) => mod.name).join(","),
//   },
// };
//
// const modsDownloadConfig = {
//   baseURL: serverUrl,
//   method: "GET",
// };
//
// const loginConfig = {
//   baseURL: serverAuthUrl,
//   url: loginApi,
//   method: "POST",
//   params: credentials,
// };
//
// async function main() {
//   // const result = await axios(modsApiConfig);
//   const result = { data: mods200 };
//
//   const modsAvailableForUpdate = result.data.results.reduce((acc, mod) => {
//     const availableVersionForUpdate = mod.releases
//       .filter((release) => {
//         const currentModVersion = currentModsList.find(
//           (currentMod) => currentMod.name === mod.name
//         ).version;
//         return (
//           satisfies(
//             factorioVersion,
//             `^${release.info_json?.factorio_version}`
//           ) &&
//           compare(release.version, currentModVersion, ">") &&
//           satisfies(release.version, `^${currentModVersion}`)
//         );
//       })
//       .sort((a, b) => compareVersions(a.version, b.version))
//       .pop();
//
//     if (availableVersionForUpdate) {
//       return [
//         ...acc,
//         {
//           name: mod.name,
//           availableVersionForUpdate,
//         },
//       ];
//     }
//
//     return acc;
//   }, []);
//
//   if (modsAvailableForUpdate.length === 0) {
//     return;
//   }
//
//   // backup current mods
//   const zip = new JSZip();
//   const mocksFolder = zip.folder("mocks");
//
//   modsDirFiles.forEach((file) => {
//     const filesData = fs.readFileSync(`mocks/${file}`);
//     mocksFolder.file(file, filesData);
//   });
//
//   zip
//     .generateNodeStream({ type: "nodebuffer", streamFiles: true })
//     .pipe(fs.createWriteStream("sample.zip"))
//     .on("finish", function () {
//       console.log("sample.zip written.");
//     });
//
//   const {
//     data: [token],
//   } = await axios(loginConfig);
//
//   const downloads = modsAvailableForUpdate.map((mod) => {
//     const {
//       availableVersionForUpdate: { download_url, file_name },
//     } = mod;
//
//     return downloadFile(
//       {
//         ...modsDownloadConfig,
//         url: download_url,
//         params: { username: credentials.username, token },
//       },
//       `./downloads/${file_name}`
//     );
//   });
//
//   try {
//     await Promise.all(downloads);
//   } catch (e) {
//     console.log("error", e);
//   }
// }
//
// main()
//   .then(() => {
//     console.log("Success");
//   })
//   .catch((e) => {
//     console.log("Error", e);
//   });
//
// async function downloadFile(requestConfig = {}, outputLocationPath) {
//   if (fs.existsSync(outputLocationPath)) {
//     console.log(`${path.basename(outputLocationPath)} already exists!`);
//
//     return Promise.resolve();
//   }
//   const writer = fs.createWriteStream(outputLocationPath);
//
//   return axios({
//     ...requestConfig,
//     responseType: "stream",
//   }).then((response) => {
//     return new Promise((resolve, reject) => {
//       response.data.pipe(writer);
//       let error = null;
//       writer.on("error", (err) => {
//         error = err;
//         writer.close();
//         reject(err);
//       });
//       writer.on("close", () => {
//         if (!error) {
//           resolve(true);
//         }
//       });
//     });
//   });
// }
