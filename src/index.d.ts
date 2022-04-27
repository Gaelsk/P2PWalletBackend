import { IUserAttributes } from "./defs";

declare module "express-serve-static-core" {
    export interface Request {
        user?: IUserAttributes;
    }
}