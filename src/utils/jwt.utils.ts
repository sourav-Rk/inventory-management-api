import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export default function generateTokens(userId: string): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = jwt.sign({ id: userId }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
  const refreshToken = jwt.sign({ id: userId }, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
}
