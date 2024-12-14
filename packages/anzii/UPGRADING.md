# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog](CHANGELOG.md).

## 7.0.0

**This release incorporates latest standards in nodejs-based applications. This version of anzii fully supports ecma script modules, Not only does it support this latest standard in nodejs, but it has also been made to be backward-compatible with the previous versions of nodejs. Nonetheless, this is a breaking change in so many ways. We have included an upgrade guide below for users who wish to use the latest version .**

Please refer to the instructions below for upgrading to this version of anzii.

### Changes to initialization

We have decided to export anzii as a named export. If you previously did:

### Without plugins:

#### Single line

```js
require("anzii")();
```

#### Multilines

```
    const anzii = require('anzii')
    anzii()

```

## You must now do:

### Without plugins

#### Single line

```js
require("anzii").anzii();
```

#### Multilines

```
    const {anzii} = require('anzii')
    anzii()

```

### With Plugins

#### with a single plugin

##### Single line

```js
require("anzii")({ Hello: require("./hello") }); // Hello plugin in the same directory
```

#### Multilines

    ```js

        const anzii = require('anzii')
        const plugins = require('./plugins') // plugins.js containing plugins in an object
        anzii(plugins) // anzii takes an object of plugins as an argument

    ```

## You must now do:

### With Plugins

#### with a single plugin

##### Single line

```js
require("anzii").anzii({ Hello: require("./hello") }); // Hello plugin in the same directory
```

#### Multilines

    ```js

        const {anzii} = require('anzii')
        const plugins = require('./plugins') // plugins.js containing plugins in an object
        anzii(plugins) // anzii takes an object of plugins as an argument

    ```
