module.exports = {
    askForDataAccess,
    askForService,
};

function askForDataAccess() {
    const context = this.context;
    // don't prompt if data are imported from a file
    if (context.useConfigurationFile) {
        return;
    }
    const databaseType = context.databaseType;
    const done = this.async();
    const prompts = [
        {
            when: () => databaseType !== 'no',
            type: 'list',
            name: 'dataAccess',
            message: 'Do you want to use separate repository class for your data access?',
            choices: [
                {
                    value: 'repository',
                    name: 'Yes, generate a separate Repository class',
                },
            ],
            default: 0,
        },
    ];
    this.prompt(prompts).then(props => {
        context.dataAccess = props.dataAccess;
        done();
    });
}

function askForService() {
    const context = this.context;
    // don't prompt if data is imported from a file or server is skipped
    if (context.useConfigurationFile || context.skipServer) {
        return;
    }
    const done = this.async();
    const prompts = [
        {
            type: 'list',
            name: 'service',
            message: 'Do you want to use separate service class for your business logic?',
            choices: [
                {
                    value: 'no',
                    name: 'No, the REST controller should use the repository directly',
                },
                {
                    value: 'serviceClass',
                    name: 'Yes, generate a separate service class',
                },
                {
                    value: 'serviceImpl',
                    name: 'Yes, generate a separate service interface and implementation',
                },
            ],
            default: 0,
        },
    ];
    this.prompt(prompts).then(props => {
        context.service = props.service;
        done();
    });
}
