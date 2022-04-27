import { Dialect, Sequelize } from "sequelize";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

const DB_NAME = process.env.DB_NAME as string;
const Db_USER = process.env.DB_USER as string;
const DB_HOST = process.env.DB_HOST;
const DB_DRIVER = process.env.DB_DRIVER as Dialect;
const DB_PASSWORD = process.env.DB_PASSWORD as string;

const sequelizeConnection = new Sequelize(DB_NAME, Db_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DRIVER,
});

export default sequelizeConnection;

export const dbInit = () => {
  User.sync({ alter: true });
};
