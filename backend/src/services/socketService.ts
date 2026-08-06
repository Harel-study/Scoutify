import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  // add other fields if necessary
}

class SocketService {
  private io: SocketIOServer | null = null;
  // Map of userId -> Set of socketIds (to support multiple devices)
  private userSockets: Map<string, Set<string>> = new Map();

  public init(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          process.env.CLIENT_URL || 'http://localhost:5173',
          'https://scoutify-6dot.onrender.com'
        ],
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.use((socket, next) => {
      // You can pass token in handshake auth
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as UserPayload;
        socket.data.user = decoded;
        next();
      } catch (err) {
        return next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.data.user.id;
      logger.info(`User ${userId} connected with socket ${socket.id}`);

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);

      socket.on('disconnect', () => {
        logger.info(`User ${userId} disconnected from socket ${socket.id}`);
        const userSet = this.userSockets.get(userId);
        if (userSet) {
          userSet.delete(socket.id);
          if (userSet.size === 0) {
            this.userSockets.delete(userId);
          }
        }
      });
    });

    logger.info('Socket.io initialized');
  }

  public emitToUser(userId: string, event: string, data: any) {
    if (!this.io) {
      logger.warn('Socket.io is not initialized');
      return;
    }

    const userSockets = this.userSockets.get(userId.toString());
    if (userSockets && userSockets.size > 0) {
      userSockets.forEach(socketId => {
        this.io!.to(socketId).emit(event, data);
      });
    }
  }
}

export default new SocketService();
