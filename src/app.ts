import express from "express";
import cors from "cors";
import UsersRouter from "./routes/users";
import WalletsRouter from "./routes/wallets";

import db, { dbInit } from "./config/db";
import dotenv from "dotenv";
dotenv.config();

const app = express();

db.sync({ alter: true });

app.use(cors());
app.use(express.json());

app.use("/users", UsersRouter);
app.use("/wallets", WalletsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running");
});
