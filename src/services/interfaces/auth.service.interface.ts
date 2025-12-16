import { IUser } from "../../types/user.types";

export interface IAuthService {
  register(userData: IUser): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
  login(credential: { email: string; password?: string }): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
  refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }>;
}
