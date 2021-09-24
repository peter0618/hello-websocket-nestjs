import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { EventType } from './event.constant';
import { Server } from 'socket.io';
import { ChatMessage } from './messages/chat.message';

@WebSocketGateway(8080, {
  cors: { origin: ['http://peterchat.duckdns.org', 'http://localhost:3000'] },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(this.constructor.name);

  private wsClients = [];

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(EventType.CHAT)
  onEvent(@MessageBody() data: ChatMessage, @ConnectedSocket() client: any) {
    // 나를 제외한 나머지 클라이언트에 채팅 메시지를 전파합니다.
    this.wsClients.forEach((wsClient) => {
      if (wsClient !== client) {
        wsClient.emit(EventType.CHAT, data);
      }
    });
  }

  @SubscribeMessage(EventType.SAY_HI)
  async onSayHi(@MessageBody() data, @ConnectedSocket() client) {
    this.logger.debug(
      `onSayHi(nickname: ${data.nickName}, socket id: ${client.id})`,
    );
    client.id;
    // client 객체에 닉네임 property 추가
    client.nickName = data.nickName;
    const nickNames = this.wsClients.map((wsClient) => wsClient.nickName);
    this.wsClients.forEach((wsClient) => {
      const message = {
        nickName: data.nickName,
        attendants: nickNames,
      };
      wsClient.emit(EventType.SAY_HI, message);
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
    const nickNames = this.wsClients.map((wsClient) => wsClient.nickName);
    this.wsClients.forEach((wsClient) => {
      const message = {
        nickName: client.nickName,
        attendants: nickNames,
      };
      wsClient.emit(EventType.SAY_BYE, message);
    });
    this.logger.debug(`handleDisconnect() is called`);
    this.logger.debug(`연결된 client 수 : ${this.wsClients.length}`);
  }
}
