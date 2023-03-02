## 📜 Contribution

Please reference the following steps when adding a new validator icon.

1. Add or replace the icon in the `validators-logo` folder. Note that the file name should be the operator address. The preferred file format is `webp` due to the rich image quality yet small file size, but other file formats will work as well such as `jpg`, `png`, or `svg`.

2. Add the operator/consensus address mappings to `validatorAddressToPathMap` in `utils/mappings.ts`. Note that you will have to add two items to the map. The first item will be in format: `<consensus address>:<file path>`. The second item will be in format: `<operator address>:<file path>`.
