import multer from 'multer';
import path from 'path';

// Define storage location and filename format
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },

  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// Allowed file formats
const checkFileTypes = (file, cb) => {
  const allowedExtensions =
    /jpg|jpeg|png|pdf|doc|docx|csv/;

  const allowedMimeTypes =
    /image\/jpeg|image\/png|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|text\/csv/;

  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedMimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(
    new Error(
      'Only PDF, JPG, JPEG, PNG, DOC, DOCX and CSV files are allowed'
    )
  );
};

const upload = multer({
  storage,

  // 25 MB per file
  limits: {
    fileSize: 25 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    checkFileTypes(file, cb);
  }
});

export default upload;