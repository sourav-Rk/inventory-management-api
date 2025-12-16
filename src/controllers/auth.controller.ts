import { Request, Response } from "express";
import { IAuthService } from "../services/interfaces/auth.service.interface";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { sendSuccess } from "../utils/response.utils";

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async register(req: Request, res: Response): Promise<void> {
    const user = await this.authService.register(req.body);
    sendSuccess(res, MESSAGES.REGISTER_SUCCESS, user, HTTP_STATUS.CREATED);
  }

  login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);

    sendSuccess(res, MESSAGES.LOGIN_SUCCESS, result);
  };

  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: MESSAGES.AUTH_REQUIRED });
      return;
    }
    const result = await this.authService.refreshToken(refreshToken);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  };
}
