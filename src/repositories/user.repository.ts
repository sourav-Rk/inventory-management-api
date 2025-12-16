import { UserModel } from "../models/user.model";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { IUser } from "../types/user.types";

export class UserRepository implements IUserRepository {
  async create(user: IUser): Promise<IUser> {
    const newUser = await UserModel.create(user);
    return newUser.toObject();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).select("+password");
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }
}
