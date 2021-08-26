import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly jwtService: JwtService) {}

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
