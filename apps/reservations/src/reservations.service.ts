import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservation.repository';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
    constructor(
        private readonly reservationRepository: ReservationsRepository,
        @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
    ) {}

    async create(
        createReservationDto: CreateReservationDto,
        { _id: userId, email }: UserDto,
    ) {
        return this.paymentsService
            .send('create_charge', {
                ...createReservationDto.charge,
                email,
            })
            .pipe(
                map((res) => {
                    return this.reservationRepository.create({
                        ...createReservationDto,
                        invoiceId: res.id,
                        timestamp: new Date(),
                        userId,
                    });
                }),
            );
    }

    async findAll() {
        return await this.reservationRepository.find({});
    }

    async findOne(_id: string) {
        return await this.reservationRepository.findOne({ _id });
    }

    async update(_id: string, updateReservationDto: UpdateReservationDto) {
        return await this.reservationRepository.findOneAndUpdate(
            {
                _id,
            },
            {
                $set: updateReservationDto,
            },
        );
    }

    async remove(_id: string) {
        return await this.reservationRepository.findOneAndDelete({ _id });
    }
}
