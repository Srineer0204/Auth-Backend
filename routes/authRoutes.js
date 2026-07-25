const express = require('express');
const router = express.Router();

const { 
    testAuth, 
    registerUser, 
    loginUser, 
    getProfile, 
    updateProfile, 
    logoutUser, 
    refreshTokenHandler,
    changePassword
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");

// Public routes
router.get("/", testAuth);
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);

// Protected routes
router.get("/profile", protect, getProfile);

// Admin route
router.get("/admin", protect, authorize("admin"), (req, res) => {
    res.json({
        message: "Welcome admin"
    });
});

//Refresh Token Router
router.post("/refresh", refreshTokenHandler);

//Update profile
router.put("/profile", protect, updateProfile);
//Change Password
router.put("/change-password", protect, changePassword);
//Logout 
router.post("/logout",protect,logoutUser);

module.exports = router;