<p align="center">
  <img src="./echorelay.png" title="Echo Relay - DropBox">
</p><hr>
<h2>This project is just a basic implementation. Visit <a href="https://theoneandonlyshadow/echo-relay">Echo Relay</a> for newer and better implementation</h2>
<hr>

# Index

- ![Work Flow](#work-flow)
- ![Madhav's Contributions](#madhavs-contributions)
- ![Jay's Contributions](#jayprakashs-contributions)
- ![Files](#files)
- ![Used Database](#used-database)
- ![Languages & Frameworks](#languages-and-frameworks)
- ![Dependencies](#dependencies)
- ![Storage Database](#storage-database)
- ![Important](#important)
- ![Running the Program](#running-the-program)

# Work Flow

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

# <a href="https://github.com/theoneandonlyshadow">Madhav's</a> Contributions

- Created dropbox developers account and API key
- Created dbox.js (main file) to push and pull files from the website
- Created a basic index.html to upload the file
- Created a temporary folder to store the files there before fully uploading to dropbox
- Created a basic success.html to show the user that the file has been uploaded to dropbox successfully
- Created a basic error.html to show the user that the file had trouble uploading to the dropbox
- Created temporary link in success.html to download the uploaded file

# <a href="https://github.com/Tyler731137">Jayprakash's</a> Contributions

- Added MongoDB connection to store: file name, uploaded date, time remaining, download link and file size
- Added a middleware to limit the Max File Upload Size to 250 mb
- Modified the existing Schema to add a field called 'download_link'
- Added Logs.js Controller for handling File Upload errors
- Added functionality to Append logs into logs.txt in Logs.js
- Replaced 'error.html' with 'views/error.ejs'
- Replaced 'success.html' with 'views/success.ejs'
- Replaced Static Webpage Redirection with Dynamic Webpage Redirection using EJS
- Added maximum time limit of 1 week a file can stay in the DropBox before automatic deletion from DropBox and MongoDB record.


# Files

- index.html - static main page to input files
- dbox.js - main file for dropbox transfer
- tempdir - you're sending files and these files need to be stores temporarily somewhere before transferring. Don't worry these are hashes of the file, theyre in kilobytes.
- views/success.ejs - if file upload is uploaded to dropbox, we get redirected to this page
- views/error.ejs - opposite of success.html

# Used Database

- MongoDB - 512MB (storage limit)

# Languages & Frameworks

- Node.js
- HTML
- EJS

# Dependencies

- Express
- Multer
- Dropbox
- Mongoose
- Crypto
- dotenv

# Storage Database

- Dropbox - 2GB

# API Endpoints

- '/' - This is the 'index.html' in action. 
- '/upload' - This endpoint redirects 'error.ejs' or 'success.ejs' when there's error uploading the   file, the file size exceeds 250 mb or the file has successfully uploaded respectively.
- '/download/:id - This endpoint redirects the user to a webpage where the stored file in the database is downloaded into the user's system.
 
# Important

- Replace process.env.MONGO_URI in <mongoose.connect(process.env.MONGO_URI)>  with your MongoDB connection string in the dbox.js file.
- Replace process.env.DBOX in <const dbx = new Dropbox({accessToken: process.env.DBOX, fetch: fetch});>  with your Dropbox API Key.
- Dropbox deprecated long-lived tokens and resorted to short-lived tokens. You may have to fetch a new API key from DropBox Developers frequently. ![Read More](https://www.dropboxforum.com/discussions/101000014/short-lived-access-tokens-only/773530)

# Running the program

- node dbox.js
