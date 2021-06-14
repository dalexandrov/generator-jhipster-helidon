const HELIDON_VERSION = '2.2.2';

const CACHE_MAXIMUM_SIZE = 100;
const CACHE_EXPIRE_AFTER_WRITE = '3600S';

const SQL_DB_OPTIONS = [
    {
        value: 'mysql',
        name: 'MySQL',
    },
    {
        value: 'postgresql',
        name: 'PostgreSQL',
    },
    {
        value: 'oracle',
        name: 'Oracle',
    },
    {
        value: 'h2Disk',
        name: 'H2 with disk-based persistence',
    },
    {
        value: 'h2Memory',
        name: 'H2 with in-memory persistence',
    },
];

const constants = {
    HELIDON_VERSION: HELIDON_VERSION,
    CACHE_MAXIMUM_SIZE,
    CACHE_EXPIRE_AFTER_WRITE,
    SQL_DB_OPTIONS,
};

module.exports = constants;
