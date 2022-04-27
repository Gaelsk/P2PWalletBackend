import { Optional } from "sequelize";

export interface IUserAttributes {
  id: number;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface IUserInput extends Optional<IUserAttributes, "id"> {}
export interface IUserOuput extends Required<IUserAttributes> {}

export interface IPayStackCutomer {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface IUserWalletAttributes {
  id: number;
  userId: number;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface IUserWalletInput
  extends Optional<IUserWalletAttributes, "id"> {}
export interface IUserWalletOuput extends Required<IUserWalletAttributes> {}
