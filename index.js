//requires
const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config()

//basic configurations
const app = express();
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Configure multer to store files with original names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    const timestamp = new Date();
    const timestring = timestamp.toDateString();
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    cb(null, `${basename}-${timestring}${extname}`); // use the original file name
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
