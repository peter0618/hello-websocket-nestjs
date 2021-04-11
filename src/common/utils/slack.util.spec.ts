import { SlackUtil } from './slack.util';

describe('slack util', () => {
  it('has to send slack message', async () => {
    const title = '신규 회원가입 알림';

    let message = `\`\`\`* 회원 ID : 1\n`;
    message += `* 회원명 : 최병준\n`;
    message += `* 닉네임 : 피터\n`;
    message += `* 로그인아이디 : peter0618\n`;
    message += `* 이메일주소 : cbj0618@gmail.com\n`;
    message += `\`\`\``;

    SlackUtil.send(title, message, null, ':helmet_with_white_cross');
  });
});
