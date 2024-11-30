# To-Do List [Fixes]

## **_To Do_**

### Cosmetics

- Fix stri-ansi package ESM issue on a yarn install of kotii
  > **NOTE** It appears that a cjs or esm module is referencing an esm module in esm or an esm module is referencing a cjs module, which is not allowed by the ESM module system. This happens with `string-ansi` npm package. A post of stackoverflow a solution that is yet to be implemented as of 17/11/2024
