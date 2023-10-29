import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ReservationDocument, ReservationSchema } from './models/reservation.schema';
import { ReservationsRepository } from './reservation.repository';

@Module({
    imports: [
        DatabaseModule,

        DatabaseModule.forFeature([
          { name: ReservationDocument.name, schema: ReservationSchema },
        ]),
        
        LoggerModule,
      ],
      controllers: [ReservationsController],
      providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
