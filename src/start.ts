import fs from 'fs';
import path from 'path';

import { initConfig } from './config';
import { run } from './cli';
import { DEFAULT_OPTIONS, GAME_SERVICE_ADDRESS } from './constants';
import { main } from './main';

initConfig({
  gameServiceAddress: GAME_SERVICE_ADDRESS,
  defaultOptions: DEFAULT_OPTIONS,
});

const {
  username,
  password,
} =  JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'credentials.json')).toString());

run([
  'node',
  'factorio-mods-updater',
  '--username', username,
  '--password', password,
  '--semi-versions', 'beta',
  '--server-dir', './__test-env__'
]);

main()
  .then((message) => {
    console.log(message || 'Mods updated success!');
  })
  .catch((e) => {
    console.error('Error mods update!', e);
  });
