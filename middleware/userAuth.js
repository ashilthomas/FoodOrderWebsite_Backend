import jwt from "jsonwebtoken";
import "dotenv/config";

function authenticateUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.sendStatus(401); 
  }
  jwt.verify(token, process.env.SKT, (err, user) => {
    

    if (err) return res.sendStatus(403);
    
    req.user = user;

    next();
  });
}

export default authenticateUser;
