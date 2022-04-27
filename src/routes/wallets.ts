import express from "express";
import {
  creditWallet,
  transferMoney,
  webhookHandler,
} from "../controllers/wallets";
import authMiddleware from "../middlewares/auth";
const WalletsRouter = express.Router();

WalletsRouter.post("/", authMiddleware, creditWallet);
WalletsRouter.post("/transfer", authMiddleware, transferMoney);
WalletsRouter.post("/webhook/url", webhookHandler);

export default WalletsRouter;
