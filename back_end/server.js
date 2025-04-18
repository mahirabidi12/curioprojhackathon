import app from "./app.js";
import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import syncRoutes from './routes/syncRoutes.js'
// import connectDb from "./config/db.js";
import cors from 'cors'

app.use(cors());

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);

app.use("/sync",syncRoutes)

app.listen(3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
// connectDb();
 