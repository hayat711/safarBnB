import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenPayload } from '../interfaces/token-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
        configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) =>
                    request?.cookies?.Authentication || request?.Authentication,
            ]),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate({ userId }: TokenPayload) {
        return this.usersService.getUser({ _id: userId });
    }
}
