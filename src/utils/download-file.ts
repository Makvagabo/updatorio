import fs from 'fs';
import path from 'path';
import axios from 'axios';

export async function downloadFile(requestConfig = {}, outputLocationPath: string) {
  if (fs.existsSync(outputLocationPath)) {
    console.log(`${path.basename(outputLocationPath)} already exists!`);

    return Promise.resolve();
  }
  const writer = fs.createWriteStream(outputLocationPath);

  return axios({
    ...requestConfig,
    responseType: "stream",
  }).then((response) => {
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);

      let error: null | Error = null;

      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });

      writer.on("close", () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  });
}
