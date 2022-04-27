import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db";
import { IUserAttributes, IUserInput } from "../defs";
import Wallet from "./Wallet";

class User
  extends Model<IUserAttributes, IUserInput>
  implements IUserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: false,
  }
);

User.hasOne(Wallet, {
  foreignKey: "userId",
  as: "wallet",
});

export default User;
