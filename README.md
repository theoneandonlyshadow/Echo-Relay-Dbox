<center><h1>Plan so far</h1></center>

- user enters the website.
- background process checks for storage residue in all DBs.
- user uploads file (drag and drop / click to open).
- file limit: 200mb
- background process compares file size and all DBs storage residue size.
- file is stored in a DB with space.
- the file is stored in the DB for 1 week max.
- background process calls MongoDB to create ObjectID unique to a file, name of the file and timestamps.
- a temporary link, QR code and a 7 digit code is displayed after successfully storing.
- max life of the temp link, QR code and the code is 1 week.
- the receiver enters the link or the code.
- the receiver receives the file.
- end.

<center><h1>Each file workin shi (for now)</h1></center>

- index.html - basic af input tag to test upload
- tempdir - youre sending files, files need to be stores temporarily somewhere before transferring, hence why i keep sayin we need a server to communicate online. Dw these are hashes of the file, theyre in kilobytes.
- server.js - nothin biggie yet. express backend will migrate there once i get all DB implementations.
- success.html - if file upload is uploaded to dropbox, we get redirected to this page
- error.html - opps of success.html

<center><h1>Used DB</h1></center>

- MongoDB - 512MB

<center><h1>Languages & Frameworks</h1></center>

- MERN
- Socket.io

<center><h1>Storage DB</h1></center>

- Dropbox - 2GB
- more on the wae
