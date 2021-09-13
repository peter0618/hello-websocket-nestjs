import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { EventType } from './event.constant';

@WebSocketGateway(8080)
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(this.constructor.name);

  private wsClients = [];

  @SubscribeMessage('chat')
  onEvent(client: any, data: { nickName: string; text: string }) {
    data['eventType'] = EventType.CHAT;
    this.wsClients.forEach((wsClient) => {
      if (wsClient !== client) {
        wsClient.send(JSON.stringify(data));
      }
    });
  }

  @SubscribeMessage('sayHi')
  onSayHi(client: any, data: any) {
    // client 객체에 닉네임 property 추가
    client.nickName = data.nickName;
    const nickNames = this.wsClients.map((wsClient) => wsClient.nickName);
    this.wsClients.forEach((wsClient) => {
      const message = {
        nickName: data.nickName,
        eventType: EventType.SAY_HI,
        attendants: nickNames,
      };
      wsClient.send(JSON.stringify(message));
    });
  }

  /**
   * 새로운 소켓 연결이 들어왔을 때
   * @param client
   */
  handleConnection(client: any): any {
    this.wsClients.push(client);
    this.logger.debug(`handleConnection() is called`);
    this.logger.debug(`연결된 client 수 : ${this.wsClients.length}`);
  }

  /**
   * 소켓 연결이 끊길 때
   * @param client
   */
  handleDisconnect(client: any): any {
    // this.logger.debug(`퇴장자 이름 : ${client.nickName}`);
    this.wsClients = this.wsClients.filter((weClient) => weClient !== client);
    const nickNames = this.wsClients.map((wsClient) => wsClient.nickName);
    this.wsClients.forEach((wsClient) => {
      const message = {
        nickName: client.nickName,
        eventType: EventType.SAY_BYE,
        attendants: nickNames,
      };
      wsClient.send(JSON.stringify(message));
    });
    this.logger.debug(`handleDisconnect() is called`);
    this.logger.debug(`연결된 client 수 : ${this.wsClients.length}`);
  }
}
