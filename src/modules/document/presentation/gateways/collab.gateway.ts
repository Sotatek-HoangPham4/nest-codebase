import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/collab', cors: true })
export class CollabGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Authentication + join rooms
    // e.g. client.join(`document:${docId}`)
  }

  @SubscribeMessage('joinDocument')
  handleJoin(
    @MessageBody() payload: { documentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`document:${payload.documentId}`);
    return { status: 'joined', documentId: payload.documentId };
  }

  @SubscribeMessage('edit')
  handleEdit(@MessageBody() payload: any) {
    // Broadcast to others
    this.server
      .to(`document:${payload.documentId}`)
      .emit('remoteEdit', payload);
  }
}
