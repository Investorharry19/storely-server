import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export const generateToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwtSecret, options);
};
export const loginToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: 1000 * 60 * 60 * 24 * 7,
  };

  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret);
};

export function generateResetPasswordToken(payload: object) {
  const options: SignOptions = {
    expiresIn: 1000 * 10,
  };

  return jwt.sign(payload, env.jwtSecret, options);
}
