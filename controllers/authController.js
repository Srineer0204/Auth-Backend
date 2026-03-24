const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const db = require("../config/db");


exports.testAuth = (req,res) => {
    res.send("Auth route working");
};


exports.registerUser = async (req,res) => {
    const {email,password} = req.body;

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

        //Insert user into MySQL
        const query = "insert into users (email,password,role) values(?,?,?)";

        db.query(query, [email,hashedPassword,"user"], (err,result) => {
            if(err){
                return res.status(500).json({
                    message: "User already exists or datbase error"
                });
            }
            res.status(201).json({
                message: "User registered successfully"
            });
        });
    } catch(error){
        res.status(500).json({ message: "Server error"});
    }
    });
};

exports.loginUser = async (req,res) => {
    
    const {email,password} = req.body;

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
            process.env.JWT__REFRESH_SECRET,
            {expiresIn: "7d"}
        );
        const tokenQuery = "update users set refresh_token = ? where id = ?";
        db.query(tokenQuery,[refreshToken, user.id],(err) => {
            if(err) {
                return res.status(500).json({ message: "Error savinf refresh token"});
            }
            res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken
        });
        
    });
});
};

exports.getProfile = (req,res) => {
    const userId = req.user.id;
    const query = "select id,email,created_at from users where id = ?";
    db.query(query, [userId], (err,results) => {
        if(err){
            return res.status(500).json({message:"Server error"});
        }
        if(results.length === 0){
            return res.status(404).json({message:"User not found"});
        }
        res.json({
            message: "User profile fetched",
            user: results[0]
        });
    });
}