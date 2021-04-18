import { Test, TestingModule } from '@nestjs/testing';
import { SlackNotificationService } from './slack-notification.service';
import { ConfigurationModule } from '../configuration/configuration.module';
import { User } from '../modules/user/entity/user.entity';
import { generate_sign_up_alarm_message } from './message-templates/slack.message.template';

describe('SlackNotificationService', () => {
  let service: SlackNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationModule],
      providers: [SlackNotificationService],
    }).compile();

    service = module.get<SlackNotificationService>(SlackNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('has to send slack message', async () => {
    const title = '신규 회원가입 알림';
    const user = Object.assign(new User(), {
      id: 1,
      name: '최병준',
      nickName: '피터',
      loginId: 'peter0618',
      email: 'cbj0618@gmail.com',
    });
    const message = generate_sign_up_alarm_message(user);
    const response = await service.sendMessage(title, message, null, ':helmet_with_white_cross');
    expect(response.status).toEqual('ok');
  });
});
