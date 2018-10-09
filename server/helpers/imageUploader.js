import cloudinary from 'cloudinary';
import multer from 'multer';
import cloudinaryStorage from 'multer-storage-cloudinary';
import cloudinaryConfig from '../config/cloudinary/cloudinaryConfig';

cloudinaryConfig();

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'lotus-ah-images/',
  allowedFormats: ['jpg', 'png', 'jpeg', 'gif'],
  filename: (req, file, callback) => {
    callback(undefined, Number(Date.now()) + file.originalname);
  },
});

const upload = multer({
  storage,
}).single('image');

export default upload;
