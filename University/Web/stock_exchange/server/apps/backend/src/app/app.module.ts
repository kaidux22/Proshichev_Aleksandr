import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { SocketIO } from './socket.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SocketIO],
})
export class AppModule {}
