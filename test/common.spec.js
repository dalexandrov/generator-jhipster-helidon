const assert = require('yeoman-assert');

const { buildCommonGeneratorContext } = require('./utils/generator-testing-api');

describe('Subgenerator common of helidon JHipster blueprint', () => {
    describe('with Helidon blueprint config', () => {
        before(buildCommonGeneratorContext());

        it('README.md should contains Helidon references', () => {
            assert.fileContent('README.md', /JHipster Helidon/);
        });
    });
});
