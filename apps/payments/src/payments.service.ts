import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE, CreateChargeDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
    private readonly stripe = new Stripe(
        this.configService.get('STRIPE_SECRET_KEY'),
        {
            apiVersion: '2023-10-16',
        },
    );
    constructor(
        private readonly configService: ConfigService,
        @Inject(NOTIFICATIONS_SERVICE)
        private readonly notificationsService: ClientProxy,
    ) {}

    async createCharge({ amount, card, email }: PaymentCreateChargeDto) {
        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card,
        });

        const paymentIntent = await this.stripe.paymentIntents.create({
            payment_method: paymentMethod.id,
            amount: amount * 100,
            confirm: true,
            payment_method_types: ['card'],
            currency: 'usd',
        });

        // emit the event to notifications service
        this.notificationsService.emit('notify_email', {
            email,
            text: `Your payment of $${amount} has been completed successfully!`,
        });

        return paymentIntent;
    }
}
