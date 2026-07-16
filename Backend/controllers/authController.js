const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            email: req.body.email,
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Replace plain password with hashed password
        req.body.password = hashedPassword;

        // Create User
        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES,
            }
        );

        // Login Success
        const userResponse = user.toObject();
delete userResponse.password;
        res
    .status(200)
    .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
        success: true,
        message: "Login Successful",
        user:userResponse,
    });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

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
const logoutUser = (req, res) => {
    res
        .status(200)
        .clearCookie("token", {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
            success: true,
            message: "Logged Out Successfully",
        });
};
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, about, skills } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (about) user.about = about;
        if (skills) user.skills = skills;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
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

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

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
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    updateProfile,
    changePassword,
};