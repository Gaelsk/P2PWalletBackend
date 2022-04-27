import { Request, Response } from "express";
import { IUserInput } from "../defs";
import User from "../models/User";
import Wallet from "../models/Wallet";
import { createPayStackCustomer } from "../utils/paystack";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../utils/data";
import { createHash } from "crypto";
import { restError, restSuccess } from "../utils";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const body = req.body as IUserInput;

    if (body.password) {
      body.password = createHash("sha256").update(body.password).digest("hex");
    }
    const newUser = await User.create(body);
    const userWallet = {
      userId: newUser.id,
      balance: 0,
    };
    await createPayStackCustomer({
      email: newUser.email,
    });
    await Wallet.create(userWallet);
    const userDoc = await User.findOne({
      where: { id: newUser.id },
      include: "wallet",
    });
    const token = jwt.sign({ id: newUser.id }, SECRET_KEY, {
      expiresIn: "1y",
    });
    return res.json(
      restSuccess({
        message: "User created successfully",
        user: userDoc,
        token,
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const body = req.body as {
      email: string;
      password: string;
    };
    const user = await User.findOne({
      where: {
        email: body.email,
        password: createHash("sha256").update(body.password).digest("hex"),
      },
      include: "wallet",
    });
    if (!user) {
      return res.status(400).json(restError("Invalid credentials", undefined));
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "1y",
    });
    return res.json(
      restSuccess({
        message: "User logged in successfully",
        user,
        token,
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(restError("Something went wrong", undefined));
  }
};

export const getAuthUser = async (req: Request, res: Response) => {
  if (req.user) {
    try {
      const auth = req.user;

      const user = await User.findByPk(auth.id, {
        include: "wallet",
      });

      return res.json(restSuccess(user));
    } catch (error) {
      console.error(error);
      return res.status(500).json(restError("Something went wrong", undefined));
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  //get users list query sequelize
  const users = await User.findAll({ include: "wallet" });
  return res.json(restSuccess(users));
};
