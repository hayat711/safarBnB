import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUser } from '../current-user.decorator';
import { UserDocument } from './models/user.schema';
import { Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(protected readonly usersService: UsersService,){}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        console.log('create user route is called!!');
        return await this.usersService.create(createUserDto)
    }
}
