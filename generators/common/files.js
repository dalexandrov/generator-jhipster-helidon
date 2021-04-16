

const files = {
    global: [
        {
            templates: ['README.md'],
        },
    ],
};

function writeFiles() {
    return {
        writeDockerFiles() {
            this.writeFilesToDisk(files, this, false, 'helidon');
        },
    };
}

module.exports = {
    writeFiles,
    files,
};
