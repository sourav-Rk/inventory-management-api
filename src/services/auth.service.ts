import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { IAuthService } from "./interfaces/auth.service.interface";
import { IUser } from "../types/user.types";
import { ENV } from "../config/env";
import { MESSAGES } from "../constants/messages";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import generateTokens from "../utils/jwt.utils";

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  // private generateTokens(userId: string) {
  //   const accessToken = jwt.sign({ id: userId }, ENV.JWT_SECRET, {
  //     expiresIn: ENV.JWT_EXPIRES_IN,
  //   } as jwt.SignOptions);
  //   const refreshToken = jwt.sign({ id: userId }, ENV.REFRESH_TOKEN_SECRET, {
  //     expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN,
  //   } as jwt.SignOptions);
  //   return { accessToken, refreshToken };
  // }

  async register(
    userData: IUser
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError(
        MESSAGES.AUTHENTICATION.USER_ALREADY_EXISTS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const tokens = generateTokens(newUser._id!.toString());
    return { user: newUser, ...tokens };
  }

  async login(credentials: {
    email: string;
    password?: string;
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user || !user.password) {
      throw new AppError(MESSAGES.INVALID_TOKEN, HTTP_STATUS.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(credentials.password!, user.password);
    if (!isMatch) {
      throw new Error(MESSAGES.INVALID_TOKEN);
    }

    const tokens = generateTokens(user._id!.toString());

    const userObj = { ...user } as any;
    if (userObj._doc) return { user: userObj._doc, ...tokens };
    delete userObj.password;

    return { user: userObj, ...tokens };
  }

  async refreshToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as {
        id: string;
      };
      const tokens = generateTokens(decoded.id);
      return tokens;
    } catch (error) {
      throw new AppError(MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }
  }
}
