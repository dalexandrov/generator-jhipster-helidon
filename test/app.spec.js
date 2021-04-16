const assert = require('yeoman-assert');

const { buildAppGeneratorContext } = require('./utils/generator-testing-api');

describe(' Subgenerator app of helidon JHipster blueprint', () => {
    describe('Application with custom configuration', () => {
        describe('OAuth2 authentication', () => {
            before(
                buildAppGeneratorContext({
                    authenticationType: 'oauth2',
                })
            );

            it('should README.md references OAuth2/OIDC with Keycloak and Okta', () => {
                assert.fileContent(
                    'README.md',
                    'helidon.oidc.enabled=true\n' +
                        'helidon.oidc.auth-server-url=http://localhost:9080/auth/realms/jhipster/\n' +
                        'helidon.oidc.client-id=web_app\n' +
                        'helidon.oidc.credentials.secret=web_app\n' +
                        'helidon.oidc.authentication.scopes=profile,address,email,address,phone,offline_access\n' +
                        'helidon.oidc.application-type=hybrid\n' +
                        'helidon.oidc.authentication.cookie-path=/\n' +
                        'helidon.oidc.authentication.redirect-path=/login/oauth2/code/oidc\n' +
                        'helidon.oidc.authentication.restore-path-after-redirect=false\n' +
                        '\n' +
                        'jhipster.oidc.logout-url=http://localhost:9080/auth/realms/jhipster/protocol/openid-connect/logout\n'
                );
                assert.fileContent(
                    'README.md',
                    'helidon.oidc.auth-server-url=https://{yourOktaDomain}/oauth2/default\n' +
                        'helidon.oidc.client-id={clientId}\n' +
                        'helidon.oidc.credentials.secret={clientSecret}\n' +
                        '\n' +
                        'jhipster.oidc.logout-url=https://{yourOktaDomain}/oauth2/default/v1/logout\n'
                );
            });
        });
    });
});
