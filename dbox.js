const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');
const crypto = require('crypto');
require('dotenv').config();

const port = 3000;
const app = express();
const upload = multer({ dest: 'tempdir/' });

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
  
      console.log('File uploaded:', uploadResponse);
  
      const dropboxFilePath = uploadResponse.result.path_lower;  // The path to the file in Dropbox
  
      const tempLinkResponse = await dbx.filesGetTemporaryLink({
        path: dropboxFilePath
      });
  
      const tempLink = tempLinkResponse.result.link;
  
      fs.unlinkSync(filePath);
  
      const uniqueId = crypto.randomBytes(8).toString('hex');
  
      tempLinks[uniqueId] = tempLink;
  
      const domain = `${req.protocol}://${req.get('host')}`;
  
      const customLink = `${domain}/${uniqueId}`;
  
      res.status(200).send(`
        <h2>File Uploaded Successfully!</h2>
        <p>Download link: <a href="${customLink}" target="_blank">${customLink}</a></p>
      `);
  
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error occurred while uploading the file.');
    }
  });
  

  app.get('/temp-link/:id', (req, res) => {
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
