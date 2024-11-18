import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { RobotCommand } from './basic.command';
import { RobotModule } from './robot/robot.module';
import configuration from './config/configuration.js';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    RobotModule,
  ],
  providers: [RobotCommand],
})
export class AppModule {}
