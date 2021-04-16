#!/usr/bin/env node

const semver = require('semver');
const path = require('path');
const { logger } = require('generator-jhipster/cli/utils');
const packageJson = require('../package.json');

const currentNodeVersion = process.versions.node;
const minimumNodeVersion = packageJson.engines.node;

if (!semver.satisfies(currentNodeVersion, minimumNodeVersion)) {
    /* eslint-disable no-console */
    logger.error(
        `You are running Node version ${currentNodeVersion}\njhipster-helidon requires Node version ${minimumNodeVersion}\nPlease update your version of Node.`
    );
    /* eslint-enable  */
}

let preferLocal = true;

// Don't use commander for parsing command line to avoid polluting it in cli.js
// --prefer-local: Always resolve node modules locally (useful when using linked module)
if (process.argv.includes('upgrade') && !process.argv.includes('--prefer-local')) {
    // Prefer global version for `jhipster upgrade` to get most recent code
    preferLocal = false;
}

// Pass in helidon as a blueprint module.
// User passes in blueprints flag but without helidon :> append helidon
if (!process.argv.includes('helidon') && process.argv.includes('--blueprints')) {
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i] === '--blueprints') {
            process.argv[i + 1] = `${process.argv[i + 1].split(',')},helidon`;
        }
    }
    // User passes in blueprint flag but without helidon :> append helidon
} else if (!process.argv.includes('helidon') && process.argv.includes('--blueprint')) {
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i] === '--blueprint') {
            process.argv[i] = '--blueprints';
            process.argv[i + 1] = `${process.argv[i + 1]},helidon`;
        }
    }
    // User do not pass in blueprints or blueprint flag but without helidon :> append helidon
} else if (!process.argv.includes('helidon') && !process.argv.includes('--blueprint') && !process.argv.includes('--blueprints')) {
    process.argv.push('--blueprints');
    process.argv.push('helidon');
}

requireCLI(preferLocal);

/*
 * Require cli.js giving priority to local version over global one if it exists.
 */
function requireCLI(preferLocal) {
    /* eslint-disable global-require */
    if (preferLocal) {
        try {
            const localCLI = require.resolve(path.join(process.cwd(), 'node_modules', 'generator-jhipster-helidon', 'cli', 'cli.js'));
            if (__dirname !== path.dirname(localCLI)) {
                // load local version
                /* eslint-disable import/no-dynamic-require */
                logger.info("Using jhipster-helidon version installed locally in current project's node_modules");
                require(localCLI);
                return;
            }
        } catch (e) {
            // Unable to find local version, so global one will be loaded anyway
            logger.log('Local install was preferred but not found.', e);
        }
    }
    // load global version
    logger.info('Using JHipster version installed globally');
    require('generator-jhipster/cli/cli.js');
    /* eslint-enable  */
}
