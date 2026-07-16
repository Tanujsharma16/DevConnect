const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        // Token from Cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please Login First",
            });
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Save user id in request
        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }
};

module.exports = authMiddleware;