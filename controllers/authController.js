const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const db = require("../config/db");


exports.testAuth = (req,res) => {
    res.send("Auth route working");
};


exports.registerUser = async (req,res) => {
    const {name, email,password} = req.body;

    const checkQuery = "select * from users where email = ?";

    db.query(checkQuery, [email], async (err,results) => {
        if(err){
            return res.status(500).json({message: "Database error"});
        }
        if(results.length > 0){
            return res.status(400).json({message:"Email already exists"});
        }
        try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const query = "insert into users (name,email,password,role) values(?,?,?,?)";

        db.query(query, [name,email,hashedPassword,"user"], (err,result) => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }
            res.status(201).json({
                success: true,
                message: "User registered successfully"
            });
        });
    } catch(error){
        res.status(500).json({ 
            success: false,
            message: "Server error"
        });
    }
    });
};

exports.loginUser = async (req,res) => {
    
    const {email, password} = req.body;

    const query = "select * from users where email = ?";

    db.query(query,[email], async (err,results) => {
        if(err){
            return res.status(500).json({message:"Server error"});
        }
        if(results.length === 0){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"});
        }

        const accessToken = jwt.sign(
            {id: user.id,email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "15m"}
        );
        const refreshToken = jwt.sign(
            {id: user.id},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: "7d"}
        );
        const tokenQuery = "update users set refresh_token = ? where id = ?";
        db.query(tokenQuery,[refreshToken, user.id],(err) => {
            if(err) {
                return res.status(500).json({ message: "Error saving refresh token"});
            }
        res.cookie("accessToken",accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        res.cookie("refreshToken",refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            success: true,
            message: "Login succesfull"
        });
    });
});
};

exports.getProfile = (req,res) => {
    const userId = req.user.id;
    const query = "select id,name,email,created_at from users where id = ?";
    db.query(query, [userId], (err,results) => {
        if(err){
            return res.status(500).json({success: false, message:"Server error"});
        }
        if(results.length === 0){
            return res.status(404).json({success: false, message:"User not found"});
        }
        res.json({
            success: true,
            message: "User profile fetched",
            user: results[0]
        });
    });
}

exports.updateProfile = (req,res) => {
    const userId = req.user.id;
    const { name } = req.body;

    if(!name || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }
    const query = "UPDATE users set name = ? WHERE id = ?";
    db.query(query, [name,userId], (err) => {
        if(err) {
            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
        res.json({
            success: true,
            message: "Profile updated successfully"
        });
    });
}

exports.changePassword = async (req,res) => {
    const userId = req.user.id;
    const {currentPassword, newPassword } =  req.body;

    if(!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const query = "select * from users where id = ?";

    db.query(query,[userId], async(err, results) => {
        if(err) {
            return res.status(500).json({
                success: false,
                message: "Internal Server error"
            });
        }
        if(results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(currentPassword,user.password);

        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword,salt);

        const updateQuery = "update users set password = ? where id = ?";

        db.query(updateQuery, [hashedPassword,userId], (err) => {
            if(err) {
                return res.status(500).json({
                    success: false,
                    message: "Internal Server error",
                });
            }
            res.json({
                success: true,
                message: "Password changed successfully"
            });
        });
    });
}

exports.refreshTokenHandler = (req,res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(401).json({message:"Refresh token expired"});
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err,decoded) => {
        if(err) {
            return res.status(403).json({success: false, message:"Invalid or expired refresh token"});
        }

        const userId = decoded.id;

        const query = "select * from users where id = ? and refresh_token = ?";

        db.query(query, [userId,refreshToken], (err,results) => {
            if(err || results.length == 0) {
                return res.status(403).json({success: false, message: "Invalid refresh token"});
            }
            const user = results[0];
            const newAccessToken = jwt.sign(
                {id:user.id,email:user.email, role: user.role},
                process.env.JWT_SECRET,
                {expiresIn: "15m"}
            );
            const newRefreshToken = jwt.sign(
                {id:user.id},
                process.env.JWT_REFRESH_SECRET,
                {expiresIn: "7d"}
            );
            const updateQuery = "UPDATE users SET refresh_token = ? WHERE id = ?";
            db.query(updateQuery,[newRefreshToken,user.id],(err) => {
                if(err) {
                    return res.status(500).json({
                        success: false,
                        message: "Error updating refresh token"
                    });
                }
            })
            
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 15 *60 * 1000
            });
            res.cookie("refreshToken", newRefreshToken,{
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.json({
                success: true,
                message:"Token refreshed successfully"
            });
        });
    });
}

exports.logoutUser = (req,res) => {
    const userId = req.user.id;
    const query = "UPDATE users set refresh_token = NULL where id = ?";
    db.query(query,[userId],(err) => {
        if(err) {
            return res.status(500).json({success: false, message:"Error logging out"});
        }
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });
        
        res.json({
            success:true,
            message:"Logged Out successfully"
        });
    });
}