import inquirer from 'inquirer';

import { chooseModsForUpdate } from './choose-mods-for-update';
import { ModsForUpdate, ParsedModList } from '../types';

jest.mock('inquirer');

const mockInquirer = inquirer as jest.MockedObject<typeof inquirer>;

describe('chooseModsForUpdate', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return selected mods for update', async () => {
    const availableMods: ModsForUpdate = [
      {
        name: 'mod1',
        availableVersionForUpdate: {
          file_name: 'mod1',
          version: '1.1.0',
          download_url: 'http://mod1.zip',
          info_json: {
            factorio_version: '1.76.0',
          },
          sha1: 'ba3635dfe00f34307aace6f3f0e80c747207e4f0',
          released_at: '2022-06-29T23:59:31.508000Z',
        },
      },
    ];
    const parsedMods: ParsedModList = [
      {
        name: 'mod1',
        version: '1.0.0',
      },
      {
        name: 'mod2',
        version: '2.0.0',
      },
    ];

    // this value doesn't influence for anything, using just like a stub,
    // because it's hard to emulate handing input in the console
    mockInquirer.prompt.mockResolvedValue([{
      name: 'mod1',
      availableVersionForUpdate: {
        file_name: 'mod1',
        version: '1.1.0',
        download_url: 'http://mod1.zip',
        info_json: {
          factorio_version: '1.76.0',
        },
        sha1: 'ba3635dfe00f34307aace6f3f0e80c747207e4f0',
        released_at: '2022-06-29T23:59:31.508000Z',
      },
    }]);

    await chooseModsForUpdate(availableMods, parsedMods);

    expect(mockInquirer.prompt).toHaveBeenCalledWith(
      expect.objectContaining({
        choices: [
          {
            name: 'mod1 (1.0.0 -> 1.1.0)',
            value: {
              availableVersionForUpdate: {
                download_url: 'http://mod1.zip',
                file_name: 'mod1',
                info_json: { factorio_version: '1.76.0' },
                released_at: '2022-06-29T23:59:31.508000Z',
                sha1: 'ba3635dfe00f34307aace6f3f0e80c747207e4f0',
                version: '1.1.0',
              },
              name: 'mod1',
            },
          },
        ],
        message: 'What mods do you want to update?',
        name: 'ModsForUpdate',
        type: 'checkbox',
      })
    );
  });

  it('should throw an error when available mod doesn\'t exist in the current list of mod', async () => {
    const availableMods: ModsForUpdate = [
      {
        name: 'mod3',
        availableVersionForUpdate: {
          file_name: 'mod1',
          version: '1.1.0',
          download_url: 'http://mod1.zip',
          info_json: {
            factorio_version: '1.76.0',
          },
          sha1: 'ba3635dfe00f34307aace6f3f0e80c747207e4f0',
          released_at: '2022-06-29T23:59:31.508000Z',
        },
      },
    ];
    const parsedMods: ParsedModList = [
      {
        name: 'mod1',
        version: '1.0.0',
      },
      {
        name: 'mod2',
        version: '2.0.0',
      },
    ];

    await expect(chooseModsForUpdate(availableMods, parsedMods)).rejects.toThrow('The current mods list hasn\'t got "mod3" mod');

    expect(mockInquirer.prompt).not.toBeCalled();
  });
});
