
const constants = require('generator-jhipster/generators/generator-constants');

const { REACT_DIR } = constants;

const filesReact = {
    adminModule: [
        {
            path: REACT_DIR,
            templates: [{ file: 'modules/administration/health/health.tsx', method: 'processJsx' }],
        },
    ],
};

function writeFiles() {
    this.writeFilesToDisk(filesReact, this, false, 'react');

    this.replaceContent(
        `${REACT_DIR}modules/administration/configuration/configuration.tsx`,
        '<label>Spring configuration</label>',
        '<label>Helidon configuration</label>'
    );
}

module.exports = {
    writeFiles,
    files: filesReact,
};
