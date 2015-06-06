#Node Webapp Starter

###*Everything your need to start building a webapp quickly*

####Contains
- [Node.JS](https://nodejs.org/) or [io.js](https://iojs.org/en/index.html)
- [Express.io](http://express-io.org/)
- [SASS](http://sass-lang.com/)
- [Susy](http://susy.oddbird.net/)
- [Compass](http://compass-style.org/)
- [Breakpoint](http://breakpoint-sass.com/)
- [Grunt](http://gruntjs.com/)
- [AngularJS](https://angularjs.org/)
- [Sequelize](http://docs.sequelizejs.com/en/latest/)
- [Flightplan](https://github.com/pstadler/flightplan)

####Usage

#####During development use:
```
grunt
```
#####For production quality compiling:
```
grunt build
```
#####To run the test server:
```
npm start
```
OR
```
node app.js
```

####Setup
``` javascript
node_webapp
├── app.js // The main application file
├── backend // Holds all file relevant to the backend (ie. backend MVC)
│   ├── middleware // Store middleware in here
│   ├── models // Models go in here in Sequalize.js format
│   │   └── index.js // Handles the loading of all models in this folder
│   └── views // Everything relevant to backend views in here
│       ├── layouts // For the different layouts
│       └── partials // For all partials
├── config // All configuration files
│   ├── config.json // The config file that gets loaded (in .gitignore)
│   ├── config.sample.json // An example of the config file
│   ├── dev_config.rb // For compiling SASS, Compass, and Susy
│   ├── pm2.json // The actual config file for PM2 (in .gitignore)
│   ├── pm2.sample.json // An example of a PM2 process file
│   └── prod_config.rb // The production quality version of SASS compiling
├── flightplan.js // Handles delivering the app to a server
├── frontend // All files relevant to frontend/browser compilation
│   ├── font // Store all fonts here
│   ├── img // All images go here
│   ├── js // All Javascript goes here
│   │   └── app // Everything for frontend single page application here
│   └── scss // All SASS files will be stored here
├── migrations // Contains information for migrating the server
└── test // Will load your tests from this folder
```