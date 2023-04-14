export type Options = {
  gameVersion?: string;
  modsUrl: string;
  downloadModsUrl: string;
  authUrl: string;
  semiVersions: 'beta' | 'patch' | 'minor' | 'major';
  serverDir: string;
  interactive: boolean
  backup: boolean
};

export type SatisfiesModsVersionCondition = '^' | '~' | '';

export type Credentials = {
  username: string;
  password: string;
};

export type ProgramOptions = Required<Options & Credentials>;

export type Config = {
  version: string;
  gameServiceAddress: string;
  defaultOptions: Options;
};

export type ModList = {
  mods: Array<{
    name: string;
    enabled: boolean;
  }>;
};

export type ParsedModFiles = Array<{
  name: string;
  version: string;
}>;

export type ParsedModList = Array<{
  name: string;
  version: string;
}>;

export type ModsReleasesInfoData = {
  results: Array<{
    name: string;
    releases: Array<{
      download_url: string;
      file_name: string;
      info_json: {
        factorio_version: string;
      };
      released_at: string;
      version: string;
      sha1: string;
    }>;
  }>;
};

export type ModsForUpdate = Array<{
  name: string;
  availableVersionForUpdate: ModsReleasesInfoData['results'][number]['releases'][number];
}>;
