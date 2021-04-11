import { User } from '../../modules/user/entity/user.entity';

/**
 * 사용자 회원 가입 시 전송할 슬랙 알림 메시지를 생성합니다.
 * @param user
 */
export const generate_sign_up_alarm_message = (user: User) => {
  const { id, name, nickName, loginId, email } = user;
  let message = `\`\`\`* 회원 ID : ${id}\n`;
  message += `* 회원명 : ${name}\n`;
  message += `* 닉네임 : ${nickName}\n`;
  message += `* 로그인아이디 : ${loginId}\n`;
  message += `* 이메일주소 : ${email}\n`;
  message += `\`\`\``;
  return message;
};

// TODO : 로그인 알림 메시지 생성 추가
