const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

module.exports = uploadPhotoRoute = async (file, userId) => {
  try {
    const newFileName = userId + '.png';
    const filePath = path.join("src", "uploads", newFileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Convert the uploaded file to PNG using Sharp
    await sharp(file.data)
      .png()
      .toFile(filePath);

    return "/" + newFileName;
  } catch (err) {
    console.error("Error in Uploading Image:", err);
    return "Error in Uploading Image!";
  }
};
