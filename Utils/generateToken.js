import jwt from "jsonwebtoken";
import "dotenv/config";

const getToken = (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json({
                success: false,
                message: "User information is missing",
            });
        }

        if (!process.env.SKT) {
            return res.status(500).json({
                success: false,
                message: "Secret key is missing",
            });
        }

        const options = {
            id: req.user._id,
            time: Date.now(),
        };

        const token = jwt.sign(options, process.env.SKT, { expiresIn: "30m" });

        res.status(200)
            .cookie("token", token)
            .json({
                success: true,
                user: req.user,
                token,
                message: "Logged in successfully",
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Token generation failed",
        });
    }
};

export default getToken;

// {
//     // httpOnly: false,
   
//     // sameSite: "Strict", // Helps prevent CSRF attacks
  
// }
