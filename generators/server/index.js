/* eslint-disable consistent-return */
const chalk = require('chalk');
const os = require('os');
const ServerGenerator = require('generator-jhipster/generators/server');
const prompts = require('./prompts');
const writeFiles = require('./files').writeFiles;
const { HELIDON_VERSION } = require('../generator-helidon-constants');

module.exports = class extends ServerGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint Helidon')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // This sets up options for this sub generator and is being reused from JHipster
        //jhContext.setupServerOptions(this, jhContext);
    }

    get initializing() {
        const phaseFromJHipster = super._initializing();
        const phaseFromHelidon = {
            defineHelidonConstants() {
                this.helidonVersion = HELIDON_VERSION;
            },
        };
        return { ...phaseFromJHipster, ...phaseFromHelidon };
    }

    get prompting() {
        const phaseFromJHipster = super._prompting();
        const phaseFromHelidon = {
            askForServerSideOpts: prompts.askForServerSideOpts,
            askForOptionalItems: undefined,
        };
        return { ...phaseFromJHipster, ...phaseFromHelidon };
    }

    get configuring() {
        const phaseFromJHipster = super._configuring();
        const phaseFromHelidon = {
            configureGlobalHelidon() {
                // Override JHipster cacheManagerIsAvailable property to only handle Helidon caches
                //this.cacheManagerIsAvailable = ['redis'].includes(this.cacheProvider);
            },
        };

        return { ...phaseFromJHipster, ...phaseFromHelidon };
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        return writeFiles(this.buildTool);
    }

    get install() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._install();
    }

    get end() {
        return {
            end() {
                this.log(chalk.green.bold('\nServer application generated successfully.\n'));

                let executable = 'mvnw';
                let logMsgComment = '';
                if (os.platform() === 'win32') {
                    logMsgComment = ` (${chalk.yellow.bold(executable)} if using Windows Command Prompt)`;
                }
                this.log(chalk.green(`Run your Helidon application:\n${chalk.yellow.bold(`./${executable}`)}${logMsgComment}`));
            },
        };
    }
};
