export const mockOptions = {
  modsUrl: 'http://mods.test',
  authUrl: 'http://auth.test',
  semiVersions: 'minor' as const,
  downloadModsUrl: 'http://download.test',
  serverDir: '/server1',
  gameVersion: '1',
  username: 'user',
  password: '1234'
};
export const mockModsFiles = ['mod1_1.0.0.zip', 'mod2_2.0.0.zip', 'mod3.zip'];

export const mockParsedModsFiles = [
  {
    name: 'mod1',
    version: '1.0.0'
  },
  {
    name: 'mod2',
    version: '2.0.0'
  },
  {
    name: 'mod3',
    version: 'invalid'
  }
];

export const mockCurrentModsList = [
  {
    name: 'mod1',
    version: '1.0.0'
  },
  {
    name: 'mod2',
    version: '2.0.0'
  }
];
export const mockAvailableModsForUpdate = [{
  name: 'aai-containers',
  availableVersionForUpdate: {
    download_url: '/download/aai-containers/62bce7638ed1b6ac27b67aaa',
    file_name: 'aai-containers_0.2.11.zip',
    info_json: {
      factorio_version: '1.1'
    },
    released_at: '2022-06-29T23:59:31.508000Z',
    version: '0.2.11',
    sha1: 'ba3635dfe00f34307aace6f3f0e80c747207e4f0'
  }
}];
export const mockAuthToken = 'token';
