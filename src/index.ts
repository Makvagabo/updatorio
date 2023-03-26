#!/usr/bin/env node
import { initConfig } from './config';
import { run } from './cli';
import { DEFAULT_OPTIONS, GAME_SERVICE_ADDRESS } from './constants';
import { main } from './main';

initConfig({
  gameServiceAddress: GAME_SERVICE_ADDRESS,
  defaultOptions: DEFAULT_OPTIONS,
});

run();

main()
  .then((message) => {
    console.log(message || 'Mods updated success!');
  })
  .catch((e) => {
    console.error('Error mods update!', e);
  });
