import { Module } from '@nestjs/common';
import { LoggerModule as LoggerPino } from 'nestjs-pino';
@Module({
    imports: [
        LoggerPino.forRoot({
            pinoHttp: {
                transport: {
                    target: 'pino-pretty',
                    options: {
                        singleLine: true,
                    }
                }
            }
        }),

    ],
})
export class LoggerModule {}
