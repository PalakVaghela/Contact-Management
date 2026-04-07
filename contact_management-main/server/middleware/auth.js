const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
//middleware for authentication
// exports.auth = async (req, res, next) => {
//     try {
//         const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

//         if (!token) {
//             return res.status(401).json({ success: false, message: "Token Missing" });
//         }

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = decoded;

//             //  user from DB to verify role
//             const userDetails = await User.findById(decoded.userId);
//             if (!userDetails) {
//                 return res.status(404).json({ success: false, message: "User not found" });
//             }

//             req.user.role = userDetails.role;
//             next();
//         } catch (error) {
//             return res.status(401).json({ success: false, message: "Invalid token" });
//         }
//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Authentication failed" });
//     }
// };


exports.auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        console.log("User fetched from DB:", user);

        req.user = { 
            _id: user._id, 
            userId: user._id,
            role: user.role, 
            permissions: user.permissions || {}  
        };

        console.log("Assigned Permissions:", req.user.permissions); 

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Authentication failed", error: error.message });
    }
};
// Admin  middleware
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
    next();
};

// standard user access middleware (for non-admins)
// exports.isUserOrOther = (req, res, next) => {
//     if (req.user.role === "admin" || (permissions && (permissions.edit || permissions.delete))) {
//         return res.status(403).json({ success: false, message: "Access denied. cannot access this route." });
//     }
//     next();
// };


exports.isUserOrOther = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const permissions = req.user.permissions || {};

       
        console.log("User Permissions:", permissions);
        if (req.user.role === "admin") {
            return next();
        }

        if (permissions.edit || permissions.delete) {
            return next();
        }

        return res.status(403).json({ success: false, message: "Access denied. Cannot access this route." });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error in middleware", error: error.message });
    }
};
