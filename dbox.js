const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { appendLogsSuccess, appendLogsFailure } = require('./logs.js');
require('dotenv').config();

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const maxUploadLimit = 250 * 1024 * 1024;
const upload = multer({
  dest: 'tempdir/',
  limits: { fileSize: maxUploadLimit }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

const fileSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  download_link: { type: String, required: true },
  dropbox_link: { type: String, required: true },
  unique_id: { type: String, required: true },
  expire_time: { type: Date, required: true },
  time_remain: { type: Number },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

(async () => {
  const fetch = (await import('node-fetch')).default;

  const dbx = new Dropbox({
    accessToken: process.env.DBOX,
    fetch: fetch
  });

  const tempLinks = {};

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.post('/upload', (req, res, next) => {
    upload.single('file')(req, res, function (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).render('error', { errorReason: 'File size exceeds the 250 MB limit.' });
      } else if (err) {
        return res.status(500).render('error', { errorReason: 'An error occurred while uploading the file.' });
      }
      next();
    });
  }, async (req, res) => {
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    let uniqueId = '';

    try {
      const fileContent = fs.readFileSync(filePath);

      const uploadResponse = await dbx.filesUpload({
        path: '/' + fileName,
        contents: fileContent
      });

      const dropboxFilePath = uploadResponse.result.path_lower;

      const tempLinkResponse = await dbx.filesGetTemporaryLink({
        path: dropboxFilePath
      });

      const tempLink = tempLinkResponse.result.link;

      fs.unlinkSync(filePath);

      uniqueId = crypto.randomBytes(8).toString('hex');

      const expireTime = new Date();
      expireTime.setDate(expireTime.getDate() + 7);

      const timeRemaining = expireTime - Date.now();

      const domain = `${req.protocol}://${req.get('host')}`;
      const customLink = `${domain}/download/${uniqueId}`;

      const newFile = new File({
        file_name: fileName,
        download_link: customLink,
        dropbox_link: tempLink,
        unique_id: uniqueId,
        expire_time: expireTime
      });

      await newFile.save();

      tempLinks[uniqueId] = tempLink;

      appendLogsSuccess(fileName, tempLink, uniqueId, customLink);

      return res.status(200).render('success', { customLink });
    } catch (error) {
      appendLogsFailure(fileName, uniqueId, error);
      console.error('Error uploading file:', error);
      return res.status(500).render('error', { errorReason: 'An error occurred during the file upload.' });
    }
  });

  app.get('/download/:id', async (req, res) => {
    const uniqueId = req.params.id;

    const tempLink = tempLinks[uniqueId];

    if (!tempLink) {
      return res.status(404).render('error', { errorReason: 'Invalid or expired link.' });
    }

    res.redirect(tempLink);
  });

  app.listen(port, () => {
    console.log(`Dropbox app started on http://localhost:${port}`);
  });
})();

module.exports = {};
