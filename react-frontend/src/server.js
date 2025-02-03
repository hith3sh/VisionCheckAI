// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.static('uploads'));

// Multer setup for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post('/predict', upload.single('retinal_image'), (req, res) => {
  const age = parseInt(req.body.age);
  const iop = parseInt(req.body.iop);
  const imagePath = req.file ? req.file.filename : '';

  // Mock logic for glaucoma risk prediction
  let prediction = 'Low Risk of Glaucoma';
  let explanation = 'Based on age and intraocular pressure within safe limits.';
  
  if (age > 50 && iop > 20) {
    prediction = 'High Risk of Glaucoma';
    explanation = 'Based on age, high intraocular pressure, and retinal image.';
  }

  res.json({ prediction, explanation, imagePath });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
