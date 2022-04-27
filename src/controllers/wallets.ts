import { Request, Response } from "express";
import User from "../models/User";
import Wallet from "../models/Wallet";
import crypto from "crypto";
import { initializeTransaction } from "../utils/paystack";
import { restError, restSuccess } from "../utils";
var PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;

export const creditWallet = async (req: Request, res: Response) => {
  if (req.user) {
    const auth = req.user;
    try {
      const body = req.body as {
        amount: number;
      };
      const user = await User.findByPk(auth.id);
      if (!user) {
        return res.status(404).json(restError("User not found", undefined));
      } else {
        const wallet = await Wallet.findOne({ where: { userId: auth.id } });
        if (!wallet) {
          return res.status(404).json(restError("Wallet not found", undefined));
        } else {
          const { amount } = body;
          const result = await initializeTransaction({
            email: user.email,
            amount: amount * 100,
            metadata: {
              operation: "credit",
            },
          });
          if (result.status) {
            const { data } = result;
            //const { authorization_url } = data;
            return res.json(
              restSuccess({
                message: "Transaction initialized successfully",
                data,
              })
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(restError("Something went wrong", undefined));
    }
  }
};

export const transferMoney = async (req: Request, res: Response) => {
  if (req.user) {
    try {
      const auth = req.user;

      const body = req.body as {
        toUserId: number;
        amount: number;
      };
      const fromUser = await User.findByPk(auth.id);
      if (!fromUser) {
        return res.status(404).json(restError("User not found", undefined));
      } else {
        const toUser = await User.findByPk(body.toUserId);
        if (!toUser) {
          return res.status(404).json(restError("User not found", undefined));
        } else {
          const fromWallet = await Wallet.findOne({
            where: { userId: fromUser.id },
          });
          if (!fromWallet) {
            return res
              .status(404)
              .json(restError("Wallet not found", undefined));
          } else {
            const toWallet = await Wallet.findOne({
              where: { userId: body.toUserId },
            });
            if (!toWallet) {
              return res
                .status(404)
                .json(restError("Wallet not found", undefined));
            } else {
              const { amount } = req.body;
              if (fromWallet.balance < amount) {
                return res
                  .status(400)
                  .json(restError("Insufficient balance", undefined));
              } else {
                const newFromBalance = fromWallet.balance - amount;
                const newToBalance = toWallet.balance + amount;
                await fromWallet.update({ balance: newFromBalance });
                await toWallet.update({ balance: newToBalance });
                return res.json(
                  restSuccess({
                    message: "Money transferred successfully",
                    data: {
                      fromWallet: {
                        balance: newFromBalance,
                      },
                      toWallet: {
                        balance: newToBalance,
                      },
                    },
                  })
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(restError("Something went wrong", undefined));
    }
  }
};

export const webhookHandler = async (req: Request, res: Response) => {
  //validate event
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash == req.headers["x-paystack-signature"]) {
    // Retrieve the request's body
    const event = req.body;
    console.log("event", event);
    // Handle the event
    // A charge request was made
    if (event.event == "charge.success") {
      if (event.data.metadata.operation == "credit") {
        const { amount, customer } = event.data;
        const { email } = customer;
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        } else {
          const wallet = await Wallet.findOne({ where: { userId: user.id } });
          if (!wallet) {
            return res.status(404).json({
              message: "Wallet not found",
            });
          } else {
            const newBalance = wallet.balance + amount / 100;
            await wallet.update({ balance: newBalance });
            return res.sendStatus(200);
          }
        }
      }
    } else {
      return res.sendStatus(200);
    }
  }
};
