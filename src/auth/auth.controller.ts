import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDTO, refreshDTO, RegisterDTO } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService, private readonly users: UsersService){};

    @Post('register')
    register(@Body() dto: RegisterDTO) { return this.auth.register(dto); }

    @Post('login') @HttpCode(200)
    login(@Body() dto: LoginDTO) { return this.auth.login(dto); }

    @UseGuards(JwtAuthGuard) @Get('me')
    me(@CurrentUser() user: { id: string} ) { return this.users.findById(user.id);}

    @Post('refresh') @HttpCode(200)
    refresh(@Body() dto: refreshDTO) { return this.auth.refresh(dto.refreshToken) };

    @UseGuards(JwtAuthGuard) @Post('logout') @HttpCode(204)
    logout(@CurrentUser() user: {id: string}) { return this.auth.logout(user.id) }; 
}
