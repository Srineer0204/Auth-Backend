const express = require('express');
const router = express.Router();

const { testAuth, registerUser, loginUser, getProfile } = require("../controllers/authController");
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

module.exports = router;