const DEFAULT_ENTITY_ANSWERS = {
    fieldAdd: false,
    relationshipAdd: false,
    dto: 'no',
    service: 'no',
    pagination: 'no',
};

const DEFAULT_SERVER_ANSWERS = {
    baseName: 'sample',
    packageName: 'com.mycompany.myapp',
    applicationType: 'monolith',
    databaseType: 'sql',
    devDatabaseType: 'h2Disk',
    prodDatabaseType: 'mysql',
    authenticationType: 'jwt',
    enableTranslation: true,
    nativeLanguage: 'en',
    languages: ['fr', 'de'],
    buildTool: 'maven',
    enableHibernateCache: true,
    rememberMeKey: '2bb60a80889aa6e6767e9ccd8714982681152aa5',
};

const DEFAULT_CLIENT_ANSWERS = {
    baseName: 'jhipster',
    clientFramework: 'angularX',
    enableTranslation: true,
    nativeLanguage: 'en',
    languages: ['fr'],
};

const DEFAULT_HELIDON_BP_OPTIONS = {
    'from-cli': true,
    skipInstall: true,
    blueprint: 'helidon',
    skipChecks: true,
};

const DEFAULT_HELIDON_ENTITY_BP_OPTIONS = {
    ...DEFAULT_HELIDON_BP_OPTIONS,
    creationTimestamp: '2021-01-01',
};

const DEFAULT_YORC_FILENAME = 'ngx-blueprint';

module.exports = {
    DEFAULT_ENTITY_ANSWERS,
    DEFAULT_SERVER_ANSWERS,
    DEFAULT_CLIENT_ANSWERS,
    DEFAULT_HELIDON_BP_OPTIONS: DEFAULT_HELIDON_BP_OPTIONS,
    DEFAULT_HELIDON_ENTITY_BP_OPTIONS: DEFAULT_HELIDON_ENTITY_BP_OPTIONS,
    DEFAULT_YORC_FILENAME,
};
