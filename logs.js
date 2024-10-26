const express = require('express');
const fs = require('fs');

const app = express();

const time = new Date();

const SuccessMsg = `------------------------------------
                    file uploaded successfully at ${time}
                    file name: ${fileName}
                    dropbox link: ${dropboxLink}
                    unique id: ${uniqueId}
                    ------------------------------------`;


const FailureMsg = `------------------------------------
                    file upload attempt at ${time}
                    file name: ${fileName}
                    unique id: ${uniqueId}
                    reason: ${error}
                    ------------------------------------`;


async function appendLogsSuccess(fileName, dropboxLink, uniqueId) {

    fs.appendFile('./logs.txt', SuccessMsg, err => {
        if (err) {
            console.error('Error writing to logs file:', err);
        }
        else console.log('File logged!');
    });
}

async function appendLogsFailure(fileName, dropboxLink, uniqueId) {

    fs.appendFile('./logs.txt', FailureMsg, err => {
        if (err) {
            console.error('Error writing to logs file:', err);
        }
        else console.log('File logged!');
    });
}

module.exports = { appendLogsSuccess, appendLogsFailure };