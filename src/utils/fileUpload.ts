import path from "node:path";
import fs from "node:fs";
import cloudinary from "../config/cloudinary";

const uploadToCloudinary = async (
  filePath: string,
  folder: string,
  filename: string,
  format: string,
  resourceType: "image" | "raw" = "image"
) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    filename_override: filename,
    format,
    resource_type: resourceType,
  });

  await fs.promises.unlink(filePath); // Delete the temporary file
  return result.secure_url;
};

const getFilePath = (filename: string) => {
  return path.resolve(__dirname, "../../public/data/uploads", filename);
};

export { uploadToCloudinary, getFilePath };
