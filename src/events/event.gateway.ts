import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway(8080)
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(this.constructor.name);

  private wsClients = [];

  @SubscribeMessage('chat')
  onEvent(client: any, data: any) {
    this.wsClients.forEach((wsClient) => {
      if (wsClient !== client) {
        wsClient.send(JSON.stringify(data));
      }
    });
  }

  @SubscribeMessage('sayHi')
  onSayHi(client: any, data: any) {
    this.wsClients.forEach((wsClient) => {
      const message = {
        nickName: data.nickName,
        eventType: 'sayHi',
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
    this.wsClients = this.wsClients.filter((weClient) => weClient !== client);
    this.logger.debug(`handleDisconnect() is called`);
    this.logger.debug(`연결된 client 수 : ${this.wsClients.length}`);
  }
}
