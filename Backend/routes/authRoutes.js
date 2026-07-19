const { registerUser,loginUser,getProfile,logoutUser ,updateProfile,changePassword,uploadProfilePhoto,verifyEmailOTP,} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");

const router = express.Router();
router.post("/register", registerUser);
router.post("/verify-email", verifyEmailOTP);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/logout", logoutUser);
router.post(
    "/upload-photo",
    authMiddleware,
    uploadProfilePhoto
);

module.exports = router;