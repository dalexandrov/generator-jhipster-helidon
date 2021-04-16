const assert = require('yeoman-assert');
const constants = require('generator-jhipster/generators/generator-constants');

const { buildServerGeneratorContext } = require('./utils/generator-testing-api');
const expectedFiles = require('./utils/expected-files');

const { SERVER_MAIN_SRC_DIR, SERVER_MAIN_RES_DIR, DOCKER_DIR, SERVER_TEST_SRC_DIR } = constants;

describe('Subgenerator server of helidon JHipster blueprint', () => {
    describe('With monolith Maven Mysql', () => {
        before(buildServerGeneratorContext());

        it('creates expected files for default configuration for server generator', () => {
            assert.file(expectedFiles.server.common);
            assert.file(expectedFiles.server.jwt);
            assert.file(expectedFiles.server.userManagement);
            assert.file(expectedFiles.server.hibernate);
            assert.file(expectedFiles.maven);
            assert.noFile(expectedFiles.cache.common);
            assert.noFile(expectedFiles.server.mongoDb);
        });

        it('pom.xml contains health check dependency', () => {
            assert.fileContent(
                'pom.xml',
                '        <dependency>\n' +
                    '            <groupId>io.helidon</groupId>\n' +
                    '            <artifactId>helidon-smallrye-health</artifactId>\n' +
                    '        </dependency>'
            );
        });

        it('second cache level property is true', () => {
            assert.fileContent(`${SERVER_MAIN_RES_DIR}META-INF/microprofile-config.properties`, 'helidon.hibernate-orm.second-level-caching-enabled=true');
        });


        it('contains hibernate second level cache needle', () => {
            assert.fileContent(`${SERVER_MAIN_RES_DIR}META-INF/microprofile-config.properties`, '# jhipster-helidon-needle-hibernate-cache-add-entry');
        });
    });


    describe('With monolith Maven no db', () => {
        before(
            buildServerGeneratorContext({
                databaseType: 'no',
                devDatabaseType: 'no',
                prodDatabaseType: 'no',
                skipUserManagement: true,
            })
        );

        it('creates expected files for default configuration for server generator', () => {
            assert.file(expectedFiles.server.common);
            assert.noFile(expectedFiles.server.userManagement);
            assert.noFile(expectedFiles.server.hibernate);
            assert.noFile(expectedFiles.server.h2);
            assert.noFile(expectedFiles.server.mongoDb);
            assert.file(expectedFiles.maven);
        });
    });

    describe('With maven Mysql no second cache level', () => {
        before(
            buildServerGeneratorContext({
                enableHibernateCache: false,
            })
        );

        it('creates expected files for default configuration for server generator', () => {
            assert.file(expectedFiles.server.common);
            assert.file(expectedFiles.maven);
            assert.file(expectedFiles.docker);
        });

        it('second cache level property is false', () => {
            assert.fileContent(`${SERVER_MAIN_RES_DIR}META-INF/microprofile-config.properties`, 'helidon.hibernate-orm.second-level-caching-enabled=false');
        });
    });

    describe('With maven Mysql and no cache', () => {
        before(
            buildServerGeneratorContext({
                cacheProvider: 'no',
            })
        );

        it("don't create cache files", () => {
            assert.noFile(expectedFiles.cache.common);
        });

        it('should pom.xml not contains helidon cache dependency', () => {
            assert.noFileContent(
                'pom.xml',
                '        <dependency>\n' +
                    '            <groupId>io.helidon</groupId>\n' +
                    '            <artifactId>helidon-cache</artifactId>\n' +
                    '        </dependency>'
            );
        });

        it('should UserService not contains cache implementation', () => {
            assert.noFileContent(
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/service/UserService.java`,
                'import io.helidon.cache.CacheInvalidate;'
            );

            assert.noFileContent(
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/service/UserService.java`,
                '@CacheInvalidate(cacheName = User.USERS_BY_EMAIL_CACHE)'
            );

            assert.noFileContent(
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/service/UserService.java`,
                '@CacheInvalidate(cacheName = User.USERS_BY_LOGIN_CACHE)'
            );
        });
    });

    describe('With Maven OAuth2', () => {
        before(
            buildServerGeneratorContext({
                authenticationType: 'oauth2',
            })
        );

        it('should creates OAuth2 files', () => {
            assert.file(expectedFiles.server.oauth2);
        });

        it('should not creates JWT files', () => {
            assert.noFile(expectedFiles.server.jwt);
        });

        it('should not creates user management', () => {
            assert.noFile(expectedFiles.server.userManagement);
        });

        it('should pom.xml contains helidon OIDC dependency', () => {
            assert.fileContent(
                'pom.xml',
                '        <dependency>\n' +
                    '            <groupId>io.helidon</groupId>\n' +
                    '            <artifactId>helidon-oidc</artifactId>\n' +
                    '        </dependency>'
            );
            assert.noFileContent(
                'pom.xml',
                '        <dependency>\n' +
                    '            <groupId>io.helidon</groupId>\n' +
                    '            <artifactId>helidon-jwt</artifactId>\n' +
                    '        </dependency>'
            );
        });

        it('should applications.properties has helidon OIDC is enabled', () => {
            assert.fileContent(`${SERVER_MAIN_RES_DIR}META-INF/microprofile-config.properties`, 'helidon.oidc.enabled=true');
        });

        it('should JHipster properties contains OIDC logout url', () => {
            assert.fileContent(`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/config/JHipsterProperties.java`, 'public String logoutUrl;');

            assert.fileContent(
                `${SERVER_MAIN_RES_DIR}META-INF/microprofile-config.properties`,
                'jhipster.oidc.logout-url=http://localhost:9080/auth/realms/jhipster/protocol/openid-connect/logout'
            );
        });

        it('should AccountResource uses JsonWebToken to build UserDTO', () => {
            assert.fileContent(`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/web/rest/AccountResource.java`, 'JsonWebToken accessToken;');
        });
    });
});
