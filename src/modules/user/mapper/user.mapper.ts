import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { CreateUserResDto } from '../dto/user.response.dto';

/**
 * Operator Mapper class
 *
 * Entity <-> DTO transformation
 */
@Injectable()
export class UserMapper {
  /**
   * Entity -> DTO
   * @param user
   */
  toCreateUserResponseDto(user: User): CreateUserResDto {
    return {
      id: user.id,
      name: user.name,
      nickName: user.nickName,
      loginId: user.loginId,
      email: user.email,
      note: user.note,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
