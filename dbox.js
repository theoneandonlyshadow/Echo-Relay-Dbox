const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');
const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config();

const port = 3000;
const app = express();
const upload = multer({ dest: 'tempdir/' });

mongoose.connect('mongodb://127.0.0.1:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const fileSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
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

  app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const fileName = req.file.originalname;

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

      const uniqueId = crypto.randomBytes(8).toString('hex');

      tempLinks[uniqueId] = tempLink;

      const expirationPeriod = 24 * 60 * 60 * 1000;
      const expireTime = new Date(Date.now() + expirationPeriod);

      const timeRemaining = expireTime - Date.now();

      const domain = `${req.protocol}://${req.get('host')}`;
      const customLink = `${domain}/temp-link/${uniqueId}`;

      const newFile = new File({
        file_name: fileName,
        dropbox_link: tempLink,
        unique_id: uniqueId,
        expire_time: expireTime,
        time_remain: timeRemaining
      });

      await newFile.save();

      res.status(200).send(`
        <h2>File Uploaded Successfully!</h2>
        <p>Download link: <a href="${customLink}" target="_blank">${customLink}</a></p>
      `);

    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error occurred while uploading the file.');
    }
  });

  app.get('/temp-link/:id', async (req, res) => {
    const uniqueId = req.params.id;

    const tempLink = tempLinks[uniqueId];

    if (!tempLink) {
      return res.status(404).send('Invalid or expired link');
    }

    res.redirect(tempLink);
  });

  app.listen(port, () => {
    console.log(`Dropbox app started on http://localhost:${port}`);
  });
})();
