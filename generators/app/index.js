const chalk = require('chalk');
const AppGenerator = require('generator-jhipster/generators/app');
const constants = require('generator-jhipster/generators/generator-constants');
const packagejs = require('../../package.json');

module.exports = class extends AppGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint helidon')}`);
        }

        this.configOptions = jhContext.configOptions || {};
    }

    get initializing() {
        constants.CLIENT_DIST_DIR = 'META-INF/resources';
        const phaseFromJHipster = super._initializing();
        const phaseFromHelidon = {
            displayLogo() {
                this.log('\n');
                this.log(
                    `${chalk.green(' ██╗   ██╗ ')}${chalk.red(' ██╗   ██╗ ████████╗ ███████╗   ██████╗ ████████╗ ████████╗ ███████╗')}`
                );
                this.log(
                    `${chalk.green(' ██║   ██║ ')}${chalk.red(' ██║   ██║ ╚══██╔══╝ ██╔═══██╗ ██╔════╝ ╚══██╔══╝ ██╔═════╝ ██╔═══██╗')}`
                );
                this.log(
                    `${chalk.green(' ████████║ ')}${chalk.red(' ████████║    ██║    ███████╔╝ ╚█████╗     ██║    ██████╗   ███████╔╝')}`
                );
                this.log(
                    `${chalk.green(' ██╔═══██║ ')}${chalk.red(' ██╔═══██║    ██║    ██╔════╝   ╚═══██╗    ██║    ██╔═══╝   ██╔══██║')}`
                );
                this.log(
                    `${chalk.green(' ██║   ██║ ')}${chalk.red(' ██║   ██║ ████████╗ ██║       ██████╔╝    ██║    ████████╗ ██║  ╚██╗')}`
                );
                this.log(
                    `${chalk.green(' ╚═╝   ╚═╝ ')}${chalk.red(' ╚═╝   ╚═╝ ╚═══════╝ ╚═╝       ╚═════╝     ╚═╝    ╚═══════╝ ╚═╝   ╚═╝')}`
                );
                this.log('\n');

                this.log(chalk.white.bold('                            https://www.jhipster.tech - https://helidon.io\n'));
                this.log(chalk.white('Welcome to JHipster Helidon ') + chalk.yellow(`v${packagejs.version}`));
                this.log(chalk.white(`Application files will be generated in folder: ${chalk.yellow(process.cwd())}`));
                if (process.cwd() === this.getUserHome()) {
                    this.log(chalk.red.bold('\n️⚠️  WARNING ⚠️  You are in your HOME folder!'));
                    this.log(
                        chalk.red(
                            'This can cause problems, you should always create a new directory and run the jhipster command from here.'
                        )
                    );
                    this.log(chalk.white(`See the troubleshooting section at ${chalk.yellow('https://www.jhipster.tech/installation/')}`));
                }
                this.log(
                    chalk.green(
                        ' _______________________________________________________________________________________________________________\n'
                    )
                );
                this.log(
                    chalk.white(
                        `  Documentation for creating an application is at ${chalk.yellow('https://github.com/jhipster/jhipster-helidon')}`
                    )
                );
                this.log(
                    chalk.white(
                        `  If you find JHipster useful, consider sponsoring the project at ${chalk.yellow(
                            'https://opencollective.com/generator-jhipster'
                        )}`
                    )
                );
                this.log(
                    chalk.green(
                        ' _______________________________________________________________________________________________________________\n'
                    )
                );
            },
        };

        return { ...phaseFromJHipster, ...phaseFromHelidon };
    }

    get prompting() {
        const phaseFromJHipster = super._prompting();
        const phaseFromHelidon = {
            askForModuleName: phaseFromJHipster.askForModuleName,
        };
        return phaseFromHelidon;
    }

    get configuring() {
        const phaseFromJHipster = super._configuring();

        const phaseFromHelidon = {
            composeServer() {
                if (this.skipServer) return;
                const options = this.options;
                const configOptions = this.configOptions;

                this.composeWith(require.resolve('../server'), {
                    ...options,
                    configOptions,
                    'client-hook': !this.skipClient,
                    debug: this.isDebugEnabled,
                });
            },

            composeClient() {
                if (this.skipClient) return;
                const options = this.options;
                const configOptions = this.configOptions;

                this.composeWith(require.resolve('../client'), {
                    ...options,
                    configOptions,
                    debug: this.isDebugEnabled,
                });
            },

            composeCommon() {
                const options = this.options;
                const configOptions = this.configOptions;

                this.composeWith(require.resolve('../common'), {
                    ...options,
                    'client-hook': !this.skipClient,
                    configOptions,
                    debug: this.isDebugEnabled,
                });
            },
        };

        return { ...phaseFromJHipster, ...phaseFromHelidon };
    }

    get default() {
        const phaseFromJHipster = super._default();
        const phaseFromHelidon = {
            askForTestOpts: undefined,
            askForMoreModules: undefined,
        };
        return { ...phaseFromJHipster, ...phaseFromHelidon };
    }

    get writing() {
        return super._writing();
    }

    get end() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._end();
    }
};
