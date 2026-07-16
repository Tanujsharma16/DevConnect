const cloudinary = require("../config/cloudinary");
const uploadProfilePhoto = async (req, res) => {
    try {

        if (!req.files || !req.files.photo) {
            return res.status(400).json({
                success: false,
                message: "Please upload a photo",
            });
        }

        const photo = req.files.photo;

        const result = await cloudinary.uploader.upload(photo.tempFilePath, {
            folder: "DevConnect/ProfilePhotos",
        });

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                photoUrl: result.secure_url,
            },
            {
                new: true,
            }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile Photo Uploaded Successfully",
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    ...
    uploadProfilePhoto,
};