const multer = require('multer');
const path = require('path');
const fs = require('fs');

const reportsDir = path.join(__dirname, '../../uploads/reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, reportsDir);
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().slice(0, 10);
    const random = Math.floor(Math.random() * 1000);
    const uniqueName = `Informe-CPPO-${date}-${random}.pdf`;

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se permiten archivos PDF.'));
    }

    cb(null, true);
  }
});

module.exports = upload;