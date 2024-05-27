import express from "express"
import dotenv from "dotenv"
import connectDb from "./Config/db.js"

import "dotenv/config"
const app = express()
connectDb()




app.listen(() => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})