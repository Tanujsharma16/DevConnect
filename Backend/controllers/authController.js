const axios = require("axios");
const transporter = require("../config/email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
// ================= REGISTER =================
// ================= REGISTER =================
const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6 digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // OTP valid for 10 minutes
        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        const user = await User.create({
            ...req.body,
            email: email.toLowerCase(),
            password: hashedPassword,
            isEmailVerified: false,
            emailVerificationOTP: otp,
            emailVerificationOTPExpires: otpExpires,
        });

        // Send OTP to user's email
        await transporter.sendMail({
            from: `"DevConnect" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Verify your DevConnect email",
            text: `Your DevConnect verification OTP is ${otp}. This OTP is valid for 10 minutes.`,
        });

        res.status(201).json({
            success: true,
            message:
                "Registration successful. Please verify your email using the OTP sent to you.",
            email: user.email,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ================= VERIFY EMAIL OTP =================
const verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        if (
            user.emailVerificationOTP !== otp
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        if (
            !user.emailVerificationOTPExpires ||
            user.emailVerificationOTPExpires < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationOTP = null;
        user.emailVerificationOTPExpires = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ================= LOGIN =================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }
        if (!user.isEmailVerified) {
    return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
    });
}
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES,
            }
        );

        const userResponse = user.toObject();
        delete userResponse.password;

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login Successful",
            user: userResponse,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET PROFILE =================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            age,
            gender,
            about,
            skills,
            githubUsername,
            linkedin,
            portfolio,
            photoUrl,
        } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (age !== undefined) user.age = age;
        if (gender !== undefined) user.gender = gender;
        if (about !== undefined) user.about = about;
        if (skills !== undefined) user.skills = skills;
        if (linkedin !== undefined) user.linkedin = linkedin;
        if (portfolio !== undefined) user.portfolio = portfolio;

        // ---------- GitHub Integration ----------
        if (githubUsername !== undefined) {
            user.githubUsername = githubUsername;

            try {
                const { data } = await axios.get(
                    `https://api.github.com/users/${githubUsername}`
                );

                user.githubData = {
                    name: data.name,
                    bio: data.bio,
                    avatarUrl: data.avatar_url,
                    profileUrl: data.html_url,
                    followers: data.followers,
                    following: data.following,
                    publicRepos: data.public_repos,
                };

                // Auto update profile photo
                if (
    photoUrl !== undefined &&
    photoUrl !== null &&
    photoUrl.trim() !== ""
) {
    user.photoUrl = photoUrl;
}

            } catch (err) {
                console.log("GitHub user not found");
            }
        }

        if (photoUrl !== undefined) {
            user.photoUrl = photoUrl;
        }

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: updatedUser,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be same as old password",
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Changed Successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.files || !req.files.photo) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image",
            });
        }

        const file = req.files.photo;

        const result = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
                folder: "DevConnect/ProfilePhotos",
            }
        );

        fs.unlinkSync(file.tempFilePath);

        const user = await User.findById(req.userId);

        user.photoUrl = result.secure_url;

        await user.save();

        res.status(200).json({
            success: true,
            photoUrl: result.secure_url,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ================= LOGOUT =================
const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
};

module.exports = {
    registerUser,
    verifyEmailOTP,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    logoutUser,
    uploadProfilePhoto,
};