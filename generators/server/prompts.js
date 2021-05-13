/**
 * Overriding server prompt from official: https://raw.githubusercontent.com/jhipster/generator-jhipster/master/generators/server/prompts.js
 */
const chalk = require('chalk');

const constants = require('generator-jhipster/generators/generator-constants');
const { getBase64Secret } = require('generator-jhipster/generators/utils');

module.exports = {
    askForServerSideOpts,
};

function askForServerSideOpts(meta) {
    if (!meta && this.existingProject) return;

    const applicationType = this.applicationType;
    const reactive = this.reactive;
    let defaultPort = applicationType === 'gateway' ? '8080' : '8081';
    if (applicationType === 'uaa') {
        defaultPort = '9999';
    }
    const prompts = [
        {
            when: response => applicationType === 'gateway' || applicationType === 'microservice' || applicationType === 'uaa',
            type: 'input',
            name: 'serverPort',
            validate: input => (/^([0-9]*)$/.test(input) ? true : 'This is not a valid port number.'),
            message:
                'As you are running in a microservice architecture, on which port would like your server to run? It should be unique to avoid port conflicts.',
            default: defaultPort,
        },
        {
            type: 'input',
            name: 'packageName',
            validate: input =>
                /^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input)
                    ? true
                    : 'The package name you have provided is not a valid Java package name.',
            message: 'What is your default Java package name?',
            default: 'com.mycompany.myapp',
            store: true,
        },
        {
            when: response =>
                (applicationType === 'monolith' && response.serviceDiscoveryType !== 'eureka') ||
                ['gateway', 'microservice'].includes(applicationType),
            type: 'list',
            name: 'authenticationType',
            message: `Which ${chalk.yellow('*type*')} of authentication would you like to use?`,
            choices: response => {
                const opts = [
                    {
                        value: 'jwt',
                        name: 'JWT authentication (stateless, with a token)',
                    },
                ];
                opts.push({
                    value: 'oauth2',
                    name: 'OAuth 2.0 / OIDC Authentication (stateful, works with Keycloak and Okta)',
                });
                if (!reactive) {
                    if (['gateway', 'microservice'].includes(applicationType)) {
                        opts.push({
                            value: 'uaa',
                            name: 'Authentication with JHipster UAA server (the server must be generated separately)',
                        });
                    }
                }
                return opts;
            },
            default: 0,
        },
        {
            type: 'list',
            name: 'databaseType',
            message: `Which ${chalk.yellow('*type*')} of database would you like to use?`,
            choices: response => {
                const opts = [];
                if (!reactive) {
                    opts.push({
                        value: 'sql',
                        name: 'SQL (H2, MySQL, PostgreSQL, Oracle)',
                    });
                } else {
                    opts.push({
                        value: 'sql',
                        name: 'SQL (H2, MySQL, PostgreSQL)',
                    });
                }
                // opts.push({
                //     value: 'mongodb',
                //     name: 'MongoDB',
                // });
                if (applicationType !== 'uaa') {
                    opts.push({
                        value: 'no',
                        name: 'No database',
                    });
                }
                return opts;
            },
            default: 0,
        },
        {
            when: response => response.databaseType === 'sql',
            type: 'list',
            name: 'prodDatabaseType',
            message: `Which ${chalk.yellow('*production*')} database would you like to use?`,
            choices: reactive ? constants.R2DBC_DB_OPTIONS : constants.SQL_DB_OPTIONS,
            default: 0,
        },
        // {
        //     when: response => response.databaseType === 'sql',
        //     type: 'list',
        //     name: 'devDatabaseType',
        //     message: `Which ${chalk.yellow('*development*')} database would you like to use?`,
        //     choices: response =>
        //         [
        //             {
        //                 value: 'h2Disk',
        //                 name: 'H2 with disk-based persistence',
        //             },
        //             {
        //                 value: 'h2Memory',
        //                 name: 'H2 with in-memory persistence',
        //             },
        //         ].concat(constants.SQL_DB_OPTIONS.find(it => it.value === response.prodDatabaseType)),
        //     default: 0,
        // },
        {
            when: response => response.databaseType === 'sql' && !reactive,
            type: 'confirm',
            name: 'enableHibernateCache',
            message: 'Do you want to use Hibernate 2nd level cache?',
            default: true,
        },
        {
            type: 'list',
            name: 'buildTool',
            message: 'Would you like to use Maven for building the backend?',
            choices: [
                {
                    value: 'maven',
                    name: 'Maven',
                },
            ],
            default: 'maven',
        },
    ];

    if (meta) return prompts; // eslint-disable-line consistent-return

    const done = this.async();

    this.prompt(prompts).then(props => {
        this.serviceDiscoveryType = props.serviceDiscoveryType;

        this.authenticationType = props.authenticationType;

        if (this.authenticationType === 'jwt') {
            this.jwtSecretKey = getBase64Secret(null, 64);
        }

        // oauth expects users to be managed in IpP
        if (this.authenticationType === 'oauth2') {
            this.skipUserManagement = true;
        }

        this.packageName = props.packageName;
        this.serverPort = props.serverPort;
        if (this.serverPort === undefined) {
            this.serverPort = '8080';
        }
        this.enableHibernateCache = props.enableHibernateCache;
        this.databaseType = props.databaseType;
        this.devDatabaseType = props.devDatabaseType;
        this.prodDatabaseType = props.prodDatabaseType;
        this.searchEngine = props.searchEngine;
        this.buildTool = props.buildTool;
        this.uaaBaseName = this.getUaaAppName(props.uaaBaseName).baseName;

        if (this.databaseType === 'no') {
            this.devDatabaseType = 'no';
            this.prodDatabaseType = 'no';
            this.enableHibernateCache = false;
            if (this.authenticationType !== 'uaa') {
                this.skipUserManagement = true;
            }
        } else if (['mongodb', 'neo4j', 'couchbase', 'cassandra'].includes(this.databaseType)) {
            this.devDatabaseType = this.databaseType;
            this.prodDatabaseType = this.databaseType;
            this.enableHibernateCache = false;
        }

        done();
    });
}
