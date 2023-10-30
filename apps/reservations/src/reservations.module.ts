import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import {
    ReservationDocument,
    ReservationSchema,
} from './models/reservation.schema';
import { ReservationsRepository } from './reservation.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants/services';

@Module({
    imports: [
        DatabaseModule,

        DatabaseModule.forFeature([
            { name: ReservationDocument.name, schema: ReservationSchema },
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                MONGO_URI: Joi.string().required(),
                PORT: Joi.number().required(),
            }),
        }),
        LoggerModule,
        ClientsModule.registerAsync([
            {
                name: AUTH_SERVICE,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('AUTH_HOST'),
                        port: configService.get('AUTH_PORT'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [ReservationsController],
    providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
