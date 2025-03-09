//requires
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const File = require('./mongoose-models/File');

//basic configurations
const app = express();
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/uploads', express.static(process.cwd() + '/uploads'));
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//get the files stored before
app.get('/files', async(req, res) => {
  try {
    const files = await File.find({});
    const fileNames = files.map(file => file.name);
    res.json(fileNames);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files before mounting' });
  }
})


// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    const timestamp = new Date();
    const timestring = timestamp.toISOString().replace(/:/g, '-');
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const newFilename = `${basename}-${timestring}${extname}`;
    cb(null, newFilename);
  }
});
const upload = multer({ storage: storage });

//Uploading
app.post('/api/fileupload', upload.single('upfile'), async function(req, res) {
  if (!req.file) {
    return res.status(404).send({error: 'No file uploaded'});
  }

  // Create new mongoose object
  const newFile = new File({name: req.file.filename});
  try {
    await newFile.save();
  } catch (err) {
    console.log(err);
  }

  // Extract file details from the request
  const fileDetails = {
    name: req.file.filename,
    type: req.file.mimetype,
    size: req.file.size,
    url: `/uploads/${req.file.filename}`
  };

  res.json(fileDetails);
})

//Deleting
const UPLOADS_FOLDER = path.join(__dirname, 'uploads');

app.delete('/api/filedelete', upload.none(), async (req, res) => {
  const filename = req.body.name;
  
  if (!filename) {
    return res.status(400).json({ error: 'Filename is empty' });
  }

  const filePath = path.join(UPLOADS_FOLDER, filename);


  try {
    await fs.stat(filePath);  // Check if file exists
    await File.findOneAndDelete({ name: filename });
    await fs.unlink(filePath);

    //Success
    console.log("Deleted: " + filename);
    res.json({deletedName: filename});

  } catch (err) {
    console.error('Error during file deletion:', err);
    if (err.code === 'ENOENT') {
      try {
        await File.findOneAndDelete({ name: filename });
      } catch (err) {
        res.status(500).json({ error: 'Failed to delete the non-existent file from mongoose'})
      }
      return res.json({deletedName: filename});
    }
    res.status(500).json({ error: 'Failed to delete the file' });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
