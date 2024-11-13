<center><h1>Echo Relay - DropBox</h1></center>
<p align="center">
  <img src="./echorelay" width="350" title="Echo Relay - DropBox">
</p><hr>
<h2>This project is just a basic implementation. Visit <a href="https://theoneandonlyshadow/echo-relay">Echo Relay</a> for newer and better implementation</h2>
<hr>

- user enters the website.
- background process checks for storage residue in all DBs.
- user uploads file (drag and drop / click to open).
- file limit: 250 mb
- background process compares file size and all DBs storage residue size.
- file is stored in a DB with space.
- the file is stored in the DB for 1 week max.
- background process calls MongoDB to create ObjectID unique to a file, name of the file and timestamps.
- a temporary link is displayed after successfully storing.
- the receiver enters the link or the code.
- the receiver receives the file.

<center><h1><a href="https://github.com/theoneandonlyshadow">Madhav's</a> Contributions in this Project</h1></center>

- Created dropbox developers account and API key
- Created dbox.js (main file) to push and pull files from the website
- Created a basic index.html to upload the file
- Created a temporary folder to store the files there before fully uploading to dropbox
- Created a basic success.html to show the user that the file has been uploaded to dropbox successfully
- Created a basic error.html to show the user that the file had trouble uploading to the dropbox
- Created temporary link in success.html to download the uploaded file

<center><h1><a href="https://github.com/Tyler731137">Jayprakash's</a> Contributions in this Project</h1></center>

- Added MongoDB connection to store: file name, uploaded date, time remaining, download link and file size
- Added a middleware to limit the Max File Upload Size to 250 mb
- Modified the existing Schema to add a field called 'download_link'
- Added Logs.js Controller for handling File Upload errors
- Added functionality to Append logs into logs.txt in Logs.js
- Replaced 'error.html' with 'views/error.ejs'
- Replaced 'success.html' with 'views/success.ejs'
- Replaced Static Webpage Redirection with Dynamic Webpage Redirection using EJS
- Added maximum time limit of 1 week a file can stay in the DropBox before automatic deletion from DropBox and MongoDB record.


<center><h1>Files</h1></center>

- index.html - static main page to input files
- dbox.js - main file for dropbox transfer
- tempdir - you're sending files and these files need to be stores temporarily somewhere before transferring. Don't worry these are hashes of the file, theyre in kilobytes.
- views/success.ejs - if file upload is uploaded to dropbox, we get redirected to this page
- views/error.ejs - opposite of success.html

<center><h1>Used Database</h1></center>

- MongoDB - 512MB (storage limit)

<center><h1>Languages & Frameworks</h1></center>

- MERN
- EJS

<center><h1>Dependencies</h1></center>

- Express
- Multer
- Dropbox
- Mongoose
- Crypto
- dotenv (optional)

<center><h1>Storage Database</h1></center>

- Dropbox - 2GB

<center><h1>API Endpoints</h1></center>

- '/' - This is the 'index.html' in action. 
- '/upload' - This endpoint redirects 'error.ejs' or 'success.ejs' when there's error uploading the   file, the file size exceeds 250 mb or the file has successfully uploaded respectively.
- '/download/:id - This endpoint redirects the user to a webpage where the stored file in the database is downloaded into the user's system.

<center><h1>Installing Dependencies</h1></center>

- npm i express multer dropbox mongoose crypto

<center><h1>Note</h1></center>

- Replace process.env.MONGO_URI in <mongoose.connect(process.env.MONGO_URI)>  with your MongoDB connection string in the dbox.js file.
- Replace process.env.DBOX in <const dbx = new Dropbox({accessToken: process.env.DBOX, fetch: fetch});>  with your Dropbox API Key.

<center><h1>Running the program</h1></center>

- node dbox.js
