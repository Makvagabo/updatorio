# Updatorio

CLI tool for updating Factorio mods on the dedicated server.

> 📒 Be attention! This program could corrupt your game files. Don't forget to make a backup.
> 
> I added one of the possible values of parameter `--semi-versions` - `beta`, because the most mods are in beta state. It allows to update mods with 0.x.x version. But it doesn't guarantee that all be work good.

## How to use it?

1. Installing
    ```
    yarn global add updatorio@beta
    ```
1. Run
    ```
    cd ~/root-server-dir
    updatorio --username=user --pasword="your-super-secret-pawword"
    ```
1. Available options
    ```
    updatorio --help
    ```

## Developing

For developing add `credentials.json` with the **username** and **password** properties, and start:
```
yarn start
```

If you want to support this project you could make a PR or donate:
- **Bitcoin**: bc1qmm3la03m7d4s75c9r4ggneuqkyry972xkezr9s
- **Ethereum**: 0x224d404007e4193c49e4cC741f519345A2B8168d


## TODO
- [x] Check what version picks from available list
- [ ] Revert backup if an error occurs in the downloading mods process
- [ ] Hide errors under the --verbose flag
- [x] Create development environment (dev index file)
- [x] Fix destination folder for backup (must be serverDir)
- [ ] Look case when there are 2 versions of mod
- [ ] Let to choose from command line what mods to update via [Inquirer](https://github.com/SBoudrias/Inquirer.js)
