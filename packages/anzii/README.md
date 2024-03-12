# Introduction

Anzii is a backend javascript modular and event-driven framework that is simple, quick to learn and build with.

It was designed with different kinds of users in mind,so it doesn't matter if you are a designer, developer,or anything in between. If you have a basic understanding of Javascript,you can have your application working in under 2 minutes, all with a single line of code.

_If you are upgrading: please see [`UPGRADING.md`](UPGRADING.md)._

# Installation

```
npm install --save anzii

```

# Usage

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
require("anzii").anzii({ Hello: require("./hello") }); // Hello plugin in the same directory
```

#### Multilines

    ```js

        const {anzii} = require('anzii')
        const plugins = require('./plugins') // plugins.js containing plugins in an object
        anzii(plugins) // anzii takes an object of plugins as an argument

    ```

#Quick Guide

## Configurations

Anzii will look for a `.config.json` configuration in the root of your project. This configuration file is used to configure your preferences for things such _middlewares,routes,static and view directories_,etc

Please note: You can use a directory of your choice to hold your configurtion files, but those files should be imported to this configuration file **.config.json** as a final step.

```js
import routes from "./includes/routes";
import * as middlewares from "./includes/globals";

export default {
	middleware: {
		publik: { addMiddleware: middlewares.ppublic },
		privet: { addMiddleware: middlewares.pprivate },
		all: { addMiddleware: middlewares.all },
	}, // Your middlewares configurations
	view: true, // Enable rendering web pages
	router: routes, // Your api routes
	logger: { level: "info" }, // Enable info logging
	cluster: { workers: 3, spawn: true }, // Enabble cluster
};
```

## Routing Examples

In Anzii, every route is an object that contains a couple of properties that determine charateristics of that route:

```js

   {
        path: '/hello', // Route path with request handler(plugin) name(hello)
        method: 'GET', // Use get method for this route
        type: 'public', // Make this a publicly available path

    },

```

Every route object represents a handler(plugin) whose task is to handle a request in a request/response lifecycle, **more on this shortly**.

## Anzii plugins

### Example Plugin Hello

```js
class Hello {
	constructor(pao) {
		this.pao = pao; // Every plugin is passed this object
	}

	init() {
		this.listens({
			"handle-hello-task": this.handleHelloTask.bind(this), // Event and handling method
		}); // Call listens() method (available to every anzii plugin) to set events that this module  listens to
	} // Define the required init() method

	handleHelloTask(data) {
		const self = this;

		self.callback = data.callback;
		const { payload } = data;
		const { user } = payload;
		const { name, surname } = user; // assume name to be "Ntsako" and surname to be "Mashele"
		const message = `Hello ${name} ${surname}, I'm happy to meet you.'`;
		return self.callback(null, { message: message });
	}
}

export default Hello;
```

And that's it! The thing is done!
Now when you navigate to **_http://localhost:3000/hello_**
you should see the text **_Hello Ntsako Mashele, I'm happy to meet you_**.
on your browser.

### The `data` object

Every `event-handling` method of a plugin receives a `data` argument which contains `data` that the `event-handling` module expects to be able to perform and complete its task. The `data` argument is sent by an `event-emitting` module that is in need of a task that the `event-handling` performs.

In a request/response lifecycle, your `request` handling module/plugin is sent a `data` object that your plugin requires to complete its task. The emitted `data` object contains information needed in a request/response lifecycle. A picture is worth a thousand words, please refer to the `request` `data` object below:

```js

    {
        payload: {

                parsed: {
                    url: '/greeting/Ntsako/Mashele',
                    handler: 'greeting' //
                }, // Request information directly extracted from the request object
                user: { name: 'Ntsako', surname: 'Mashele' }, // Parameters or data extracted
                handler: 'hello', // Request handling plugin name (sometimes refered to as alias)
                request: {

                    req: [IncomingMessage],
                    res: [ServerResponse]
                } // Request and Response objects for further manipulation (using express framework)

        }, // Contains data about the request
        callback: [Function: bound taskerHandler] // Method to be called when task is completed

    }// Data object

```

## How does it work?

Every anzii plugin you create should include an `init()` method whose sole purpose is to call `this.listen()` method. The `this.listen()` method takes an object that contains a list of events that your plugin should listen to. As an An anzii plugin author, you define a list of events that you want to handle when emitters emit them.

Instead of listening to `events`, sometimes you create plugins that emit those events,in which case your listeners have to know about your events in order to listen to them to perform whatever task they exist to perform.

The anzii framework is its self made up of plugins building upon its base. These plugins also emit and listen to certain events.

As authors of these plugins/modules, we have defined specific events that we expect interested consumers(listeners) to listen and handle. One of these events is used in the request/response lifecycle and it takes the form `handle-pluginname-task`. This event is emitted whenever a request is made to a server running anzii.

Any plugin you implement to handle a request should listen to the event of the form `handle-pluginname-task` where `pluginname` refers to the name of your plugin.

In the `Hello` example above,the request is handled by the `Hello` plugin,so the plugin listens to the `handle-hello-task` event.

## Route Alias

There are cases where you find the use of a `handler` as part of the route object's `path`property is undesired. In such a case, you can use a `route Alias` by adding an `alias` property in the `route` object with the name of the handler as the value of the property. **See an example below**.

Using the `Hello` example above, the `route` object with an `alias` will be written this way:

```js

    {

        path: '/greeting',
        type: 'public',
        alias: 'hello'

    }

```

# Documentation

Docs coming soon!

we are currently working on our documentation with thw help from our first ever collaborater @ntsakosuprise

# Questions

For questions and support please use the official twitter page. The issue list of this repo is exclusively for bug reports and feature requests.

# Issues

Please make sure to read the Issue Reporting Checklist before opening an issue. Issues not conforming to the guidelines may be closed immediately.

# Changelog

Detailed changes for each release are documented in the release notes.

# Stay In Touch

[Twitter @anziijs](https://twitter.com/anziijs).

# Contribution

Please make sure to read the Contributing Guide before making a pull request. If you have a anzii-related plugins, add it with a pull request.

# Licence

[MIT](https://.github.com/).

copyright (c) 2019-present, iiprodatks. Ntsako (Surprise) Mashele

A Special thanks to Nicholas C. Zakas for the box presentation that help inspire Akii which has inspired anzii.
