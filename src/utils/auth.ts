import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        console.error(error);
    }
};
