import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db";
import { IUserWalletAttributes, IUserWalletInput } from "../defs";

class Wallet
  extends Model<IUserWalletAttributes, IUserWalletInput>
  implements IUserWalletAttributes
{
  public id!: number;
  public userId!: number;
  public balance!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: false,
  }
);

export default Wallet;
