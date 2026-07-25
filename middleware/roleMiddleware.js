exports.authorize = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: true,
                message: "Access denied"
            });
        }
        next();
    };
};