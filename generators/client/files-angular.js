
const constants = require('generator-jhipster/generators/generator-constants');

const { ANGULAR_DIR, CLIENT_TEST_SRC_DIR } = constants;

const filesAngular = {
    angularAdminModule: [
        {
            path: ANGULAR_DIR,
            templates: [{ file: 'admin/health/health.component.html', method: 'processHtml' }, 'admin/health/health.service.ts'],
        },
    ],
    clientTestFw: [
        {
            path: CLIENT_TEST_SRC_DIR,
            templates: ['spec/app/admin/health/health.component.spec.ts'],
        },
    ],
};

function writeFiles() {
    this.writeFilesToDisk(filesAngular, this, false, 'angular');

    this.replaceContent(
        `${ANGULAR_DIR}admin/configuration/configuration.component.html`,
        '<h3 id="spring-configuration">Spring configuration</h3>',
        '<h3 id="Helidon-configuration">Helidon configuration</h3>'
    );
}

module.exports = {
    writeFiles,
    files: filesAngular,
};
