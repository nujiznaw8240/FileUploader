//requires
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config()

//basic configurations
const app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors());
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


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


app.post('/api/fileanalyse', upload.single('upfile'), function(req, res) {
  if (!req.file) {
    return res.status(404).send({error: 'No file uploaded'});
  }

  // Extract file details from the request
  const fileDetails = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  };

  // Send the file details back as a response
  res.json(fileDetails);
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
