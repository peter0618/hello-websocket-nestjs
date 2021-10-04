import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGameRoomReqDto {
  /**
   * 방 제목
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * 최대 인원 수
   */
  @IsNumber()
  @IsNotEmpty()
  @Transform(transformParam => {
    return parseInt(transformParam.value);
  })
  maxNumberOfGamers: number;
}
