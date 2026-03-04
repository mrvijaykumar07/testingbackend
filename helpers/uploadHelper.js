import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folderName =
      file.fieldname === "planImages"
        ? "Qpix_uploads/plan_images"
        : "Qpix_uploads/library_images";

    return {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      resource_type: "image",
    };
  },
});

export const upload = multer({ storage });
