// third-party libraries
import cloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import multer from 'multer';

// moduler importations
require('dotenv').config();

cloudinary.config(
  {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  }
);

const cloudStorage = cloudinaryStorage({
  cloudinary,
  folder: 'lotus-ah',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  filename(req, file, cb) {
    cb(undefined, `${
      Date.now()}_${file.originalname.replace(/\.png|\.jpg/g, '')}`);
  }
});

export default multer({ storage: cloudStorage });
