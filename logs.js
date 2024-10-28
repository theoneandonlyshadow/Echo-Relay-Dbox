const fs = require('fs');

const time = new Date(); // Get the current date and time

async function appendLogsSuccess(fileName, dropboxLink, uniqueId, customLink) {
    // Construct the success log message with relevant information
    const SuccessMsg = `                    ------------------------------------
                    file uploaded successfully at ${time}
                    file name: ${fileName}
                    download link: ${customLink}
                    dropbox link: ${dropboxLink}
                    unique id: ${uniqueId}
                    ------------------------------------\n`;
    // Append the success message to the logs.txt file
    fs.appendFile('./logs.txt', SuccessMsg, err => {
        if (err) {
            console.error('Error writing to logs file:', err);
        } else {
            console.log('File logged successfully!');
        }
    });
}

async function appendLogsFailure(fileName, uniqueId, error) {
    // Construct the Failure log message with relevant information
    const FailureMsg = `                    ------------------------------------
                    file upload attempt at ${time}
                    file name: ${fileName}
                    unique id: ${uniqueId}
                    reason: ${error}
                    ------------------------------------\n`;
    // Append the failure message to the logs.txt file
    fs.appendFile('./logs.txt', FailureMsg, err => {
        if (err) {
            console.error('Error writing to logs file:', err);
        } else {
            console.log('File logged with failure!');
        }
    });
}

module.exports = { appendLogsSuccess, appendLogsFailure };
