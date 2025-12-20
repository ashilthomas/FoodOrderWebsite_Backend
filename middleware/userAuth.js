import jwt from "jsonwebtoken";
import "dotenv/config";

function authenticateUser(req, res, next) {
 
  // const token = req.cookies.token;
  console.log("hitting token bar");
  const authHeader = req.headers.authorization;

if (!authHeader) {
  return res.status(401).json({ message: "Token missing" });
}

const token = authHeader.split(" ")[1];
  

  // const token = req.headers.authorization?.split(' ')[1];

  console.log(token);
  
  
  

  
 
 
  if (!token) {
    return res.sendStatus(401); 
    // return res.status(401).json({
    //   succes:false,
    //   message:"Unauthorized"
    // })
  }
 

  jwt.verify(token, process.env.SKT, (err, user) => {
    

    if (err) return res.status(403).json({
      succes:false,
      message:"Token expired"
    })
    
    req.user = user;

    next();
  });
}

export default authenticateUser;
