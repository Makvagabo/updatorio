import fs from 'fs';
import path from 'path';
import axios, { AxiosRequestConfig } from 'axios';

export async function downloadFile(requestConfig: AxiosRequestConfig, outputLocationPath: string) {
  if (fs.existsSync(outputLocationPath)) {
    console.log(`"${path.basename(outputLocationPath)}" already exists!`);

    return Promise.resolve();
  }
  const writer = fs.createWriteStream(outputLocationPath);

  const response = await axios({
    ...requestConfig,
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
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
}
