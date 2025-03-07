const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name: { type: String, required: true }
});

const File = mongoose.model('File', fileSchema);
module.exports = File;