import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const { authorization } = request.headers;

    // jwt token 이 존재하는 경우
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      const jwtToken = authorization.split(' ')[1];

      // 토큰 validation
      const result = await this.authService.validateJwtToken(jwtToken);
      if (result.success === false) {
        return false;
      }

      const payload = result.payload;
      // TODO : permissionGroupId 추가
      const { id, name, loginId, nickName } = await this.userService.getById(payload.userId);

      request.user = { id, name, loginId, nickName };
      return true;
    }
    return false;
  }
}
