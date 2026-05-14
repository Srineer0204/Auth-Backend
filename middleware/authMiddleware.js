const jwt = require("jsonwebtoken");

exports.protect = (req,res,next) => {
    // let token;

    // //Check if Authorization header exists
    // if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    //     token = req.headers.authorization.split(" ")[1];
    // }

    const token = req.cookies.accessToken;
    console.log(token);
    console.log(req.cookies);
    if(!token){
        return res.status(401).json({
            message: "Not authorized, no token"
        });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error){
        return res.status(401).json({
            message: "Token Invalid"
        });
    }
};