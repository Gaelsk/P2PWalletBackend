import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { verifyToken } from "../utils/auth";
import { JwtPayload } from "jsonwebtoken";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authorization = req.headers.authorization;
        if (authorization?.split(" ")[0].toLowerCase() === "bearer") {
            const token = authorization?.split(" ")[1];

            const decoded = verifyToken(token);
            if (!decoded) {
                return res.status(401).json({
                    message: "Invalid token",
                });
            }
            const d = decoded as JwtPayload
            const user = await User.findByPk(d.id);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            req.user = user;
            next();
        } else {
            return res.status(401).json({
                message: "Invalid token",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};

export default authMiddleware;