import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getAuthUser,
} from "../controllers/users";
import authMiddleware from "../middlewares/auth";
const UsersRouter = express.Router();

UsersRouter.get("/", getUsers);
UsersRouter.post("/register", registerUser);
UsersRouter.post("/login", loginUser);
UsersRouter.get("/me", authMiddleware, getAuthUser);

export default UsersRouter;
