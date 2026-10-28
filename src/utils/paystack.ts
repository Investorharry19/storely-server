import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  console.warn("PAYSTACK_SECRET_KEY is not defined in environment variables");
}

const paystackClient = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const initializeTransaction = async (
  email: string,
  amount: number,
  callbackUrl?: string,
  metadata?: any,
) => {
  try {
    const response = await paystackClient.post("/transaction/initialize", {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      callback_url: callbackUrl,
      metadata,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      `Paystack initialization failed: ${
        error.response?.data?.message || error.message
      }`,
    );
  }
};

export const verifyTransaction = async (reference: string) => {
  try {
    const response = await paystackClient.get(
      `/transaction/verify/${reference}`,
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      `Paystack verification failed: ${
        error.response?.data?.message || error.message
      }`,
    );
  }
};
