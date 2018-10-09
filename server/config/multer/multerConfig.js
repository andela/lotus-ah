import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: './public/uploads/article-images',
  filename: (req, file, cb) => {
    cb(null, `lotus-${file.fieldname}-${Date
      .now()}${path.extname(file.originalname)}`);
  }
});

const multerUploads = multer({ storage }).single('image');

export default multerUploads;
