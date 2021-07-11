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
    // (나를 제외하고) 내가 속해 있는 room 에 접속한 사람들에게 채팅 메시지를 전파합니다.
    this.server.in(data.roomId).except(client.id).emit(EventType.CHAT, data);

    // this.wsClients.forEach(wsClient => {
    //   if (wsClient !== client) {
    //     wsClient.emit(EventType.CHAT, data);
    //   }
    // });
  }

  @SubscribeMessage(EventType.SAY_HI)
  async onSayHi(@MessageBody() data, @ConnectedSocket() client) {
    this.logger.debug(`onSayHi(nickname: ${data.nickName}, roomId: ${data.roomId}, socket id: ${client.id})`);
    // client 객체에 닉네임 property 추가 (참여자 목록을 조회해오기 위함. fixme: this.server 에서 조회해오는 방법은 없을까...?)
    client.nickName = data.nickName;

    // client.rooms 에 roomId 가 있을 때도 있고 없을 때도 있어서 아예 매핑하여 저장을 해버렸음.
    client.roomId = data.roomId;

    // 해당 room 에 join 시킴 -> 같은 room 에 있는 사용자들 끼리 채팅을 주고 받게 됨.
    client.join(data.roomId);

    // const nickNames = this.wsClients.map(wsClient => wsClient.nickName);
    const nickNames = this.wsClients
      .filter(wsClient => wsClient.rooms.has(data.roomId))
      .map(wsClient => wsClient.nickName);

    const message = {
      nickName: data.nickName,
      attendants: nickNames,
      datetime: new Date().toISOString(),
    };

    this.server.in(data.roomId).emit(EventType.SAY_HI, message);

    // this.wsClients.forEach(wsClient => {
    //   const message = {
    //     nickName: data.nickName,
    //     attendants: nickNames,
    //     datetime: new Date().toISOString(),
    //   };
    //   wsClient.emit(EventType.SAY_HI, message);
    // });
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
  handleDisconnect(@ConnectedSocket() client: any): any {
    this.wsClients = this.wsClients.filter(weClient => weClient !== client);
    // const nickNames = this.wsClients.map(wsClient => wsClient.nickName);
    const nickNames = this.wsClients
      .filter(wsClient => wsClient.rooms.has(client.roomId))
      .map(wsClient => wsClient.nickName);

    const message = {
      nickName: client.nickName,
      attendants: nickNames,
      datetime: new Date().toISOString(),
    };

    // this.wsClients.forEach(wsClient => {
    //   this.logger.debug(wsClient.rooms);
    //   const message = {
    //     nickName: client.nickName,
    //     attendants: nickNames,
    //     datetime: new Date().toISOString(),
    //   };
    //   wsClient.emit(EventType.SAY_BYE, message);
    // });
    this.server.in(client.roomId).emit(EventType.SAY_BYE, message);

    this.logger.debug(`handleDisconnect() is called`);
    this.logger.debug(`연결된 client 수 : ${this.wsClients.length}`);
  }
}
