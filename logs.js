const fs = require('fs');

const time = new Date();

async function appendLogsSuccess(fileName, dropboxLink, uniqueId, customLink) {
    const SuccessMsg = `                    ------------------------------------
                    file uploaded successfully at ${time}
                    file name: ${fileName}
                    download link: ${customLink}
                    dropbox link: ${dropboxLink}
                    unique id: ${uniqueId}
                    ------------------------------------\n`;

    fs.appendFile('./logs.txt', SuccessMsg, err => {
        if (err) {
            console.error('Error writing to logs file:', err);
        } else {
            console.log('File logged successfully!');
        }
    });
}

async function appendLogsFailure(fileName, uniqueId, error) {
    const FailureMsg = `                    ------------------------------------
                    file upload attempt at ${time}
                    file name: ${fileName}
                    unique id: ${uniqueId}
                    reason: ${error}
                    ------------------------------------\n`;

    fs.appendFile('./logs.txt', FailureMsg, err => {
        if (err) {
            console.error('Error writing to logs file:', err);
        } else {
            console.log('File logged with failure!');
        }
    });
}

module.exports = { appendLogsSuccess, appendLogsFailure };
