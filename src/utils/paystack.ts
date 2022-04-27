import axios, { HeadersDefaults } from "axios";
import { IPayStackCutomer } from "../defs";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface CommonHeaderProperties extends HeadersDefaults {
  Authorization: string;
}

axios.defaults.headers = {
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
} as CommonHeaderProperties;

export const createPayStackCustomer = async (
  customerData: IPayStackCutomer
) => {
  try {
    const { data } = await axios.post(
      `${PAYSTACK_BASE_URL}/customer`,
      customerData
    );
    console.log("data", data);
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

interface ITransactionInput {
  email: string;
  amount: number;
  metadata: {
    [key: string]: string;
  };
}

export const initializeTransaction = async (data: ITransactionInput) => {
  try {
    const { data: _data } = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      data
    );
    return _data;
  } catch (error) {
    console.error(error);
  }
};

export const verifyTransaction = async (reference: string) => {
  try {
    const { data } = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}
