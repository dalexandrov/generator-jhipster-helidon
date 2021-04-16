const chalk = require('chalk');
const needleServerCache = require('generator-jhipster/generators/server/needle-api/needle-server-cache');
const constants = require('generator-jhipster/generators/generator-constants');
const { CACHE_MAXIMUM_SIZE, CACHE_EXPIRE_AFTER_WRITE } = require('../../generator-helidon-constants');

const { SERVER_MAIN_RES_DIR } = constants;

module.exports = class extends needleServerCache {
    addEntityConfigurationToPropertiesFile(entityClass, relationships, packageName) {
        const errorMessage = chalk.yellow(`\nUnable to add ${entityClass} to META-INF/microprofile-config.properties file.`);
        const cacheName = `${packageName}.domain.${entityClass}`;
        const applicationPropertiesFileName = `${SERVER_MAIN_RES_DIR}META-INF/microprofile-config.properties`;
        const needle = 'jhipster-helidon-needle-hibernate-cache-add-entry';
        const rewriteFileModel = this.generateFileModel(
            applicationPropertiesFileName,
            needle,
            `helidon.hibernate-orm.cache."${cacheName}".expiration.max-idle=${CACHE_EXPIRE_AFTER_WRITE}\n` +
                `helidon.hibernate-orm.cache."${cacheName}".memory.object-count=${CACHE_MAXIMUM_SIZE}`
        );

        this.addBlockContentToFile(rewriteFileModel, errorMessage);

        relationships.forEach(relationship => {
            const relationshipType = relationship.relationshipType;
            if (relationshipType === 'one-to-many' || relationshipType === 'many-to-many') {
                const rewriteFileModelWithRelationships = this.generateFileModel(
                    applicationPropertiesFileName,
                    needle,
                    `helidon.hibernate-orm.cache."${cacheName}.${relationship.relationshipFieldNamePlural}".expiration.max-idle=${CACHE_EXPIRE_AFTER_WRITE}\n` +
                        `helidon.hibernate-orm.cache."${cacheName}.${relationship.relationshipFieldNamePlural}".memory.object-count=${CACHE_MAXIMUM_SIZE}`
                );
                this.addBlockContentToFile(rewriteFileModelWithRelationships, errorMessage);
            }
        });
    }
};
