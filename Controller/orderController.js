import OrderModel from "../models/orderModel.js";
import transporter from "../Config/nodemailer.js";
import "dotenv/config"


const placeOrder = async(req,res)=>{
    try {
        var mailOptions = {
            from: process.env.EMAIL_USER,
            to: '',
            subject: '',
            text: ''
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    } catch (error) {
        console.log(error);
        
    }
}

export{
    placeOrder
}