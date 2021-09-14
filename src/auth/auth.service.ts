import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../modules/user/user.service';
import { validateHash } from '../common/utils/crypto.util';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userServer: UserService,
  ) {}

  async validateUser(loginId: string, password: string) {
    const user = await this.userServer.getByLoginId(loginId);
    if (user && (await validateHash(password, user.password))) {
      return user;
    }
    return null;
  }

  async validateJwtToken(token) {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token);
      return {
        success: true,
        payload,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        error: e,
      };
    }
  }
}
