# Express TypeScript Server
An express server for exam project in [Ramverk2 *v2*](https://jsramverk.me).

# Badges
[![Build Status](https://travis-ci.org/mabn17/server-webb-trade-center.svg?branch=master)](https://travis-ci.org/mabn17/server-webb-trade-center)  
[![Build Status](https://scrutinizer-ci.com/g/mabn17/server-webb-trade-center/badges/build.png?b=master)](https://scrutinizer-ci.com/g/mabn17/server-webb-trade-center/build-status/master) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/mabn17/server-webb-trade-center/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/mabn17/server-webb-trade-center/?branch=master) [![Code Coverage](https://scrutinizer-ci.com/g/mabn17/server-webb-trade-center/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/mabn17/server-webb-trade-center/?branch=master)

# Installation
1. Clone the repo `git clone git@github.com:mabn17/server-webb-trade-center.git`.
2. Install the dependencies `cd server-webb-trade-center && npm install`
3. Change your enviremental variables inside `config/env/` *(You have to rename `.env.e.production` to `.env.production` if you want to use it in production mode)*

4. Start development server: `npm start`  
**Or**  
Start production server: `npm run run:build && npm run start:prod`

## Requirements
1. [Sqlite3](https://www.sqlite.org/index.html)
1. [Docker](https://www.docker.com/) - *(Only for test 2 - 5 see below)*

# Testing 
1. `npm test` - To see reports from the unittests.  
2. `npm run test1` - Tests on the lastest npm version. 
3. `npm run test2` - Tests on the lastest npm version 10.  
4. `npm run test3` - Tests on the lastest npm version 8.
5. `npm run test4` - Tests on the lastest npm version 6.
6. `npm run test:ci` - For ***CI*** services.

## API Documentation
1. [Authentication](src/routes/doc/Auth.md) - Login & Register route.  
2. [Personal](src/routes/doc/Personal.md) - Handles personal actions.  
3. [Stocks](src/routes/doc/Stocks.md) - Get personal/all stock values and updates stocks.  

