
const ServerCache = require('./server/needle-api/needle-server-cache');

module.exports = class NeedleApi {
    constructor(generator) {
        this.helidonServerCache = new ServerCache(generator);
    }
};
