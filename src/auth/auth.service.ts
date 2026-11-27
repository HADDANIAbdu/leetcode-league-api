import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly users: UsersService, 
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ){}
    
    async register(dto: RegisterDTO){
        const existed = await this.users.findByEmailWithPassword(dto.email);
        if(existed) throw new ConflictException('Email déjà utilisé');
        
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.users.create({
            email: dto.email,
            username: dto.username,
            passwordHash: passwordHash,
            leetcodeUsername: dto.leetcodeUsername ?? null,
        });

        return this.issueTokens(user);
    }

    async login(dto: LoginDTO){
        const user = await this.users.findByEmailWithPassword(dto.email);
        const valid = user && (await bcrypt.compare(dto.password, user.passwordHash));
        if(!valid) throw new UnauthorizedException('Identifiants invalides');
        return this.issueTokens(user);
    }

    private hash(token: string){
        return createHash('sha256').update(token).digest('hex');
    }

    private async issueTokens(user: { id: string, email: string }){
        const accessToken = this.jwt.sign({ sub: user.id, email: user.email});
        const refreshToken = this.jwt.sign(
            { sub: user.id, jti: randomUUID() },
            {
                secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
                expiresIn: Number(this.config.getOrThrow('JWT_REFRESH_EXPIRES_IN')),
            },
        );

        await this.users.setRefreshTokenHash(user.id, this.hash(refreshToken));
        return { accessToken, refreshToken };
    }

    async refresh(refreshToken: string){
        let payload: { sub: string };
        try {
            payload = this.jwt.verify(refreshToken, {
                secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
            });
        } catch {
            throw new UnauthorizedException('Refresh token invalide');
        }

        const user = await this.users.findByIdWithRefreshHash(payload.sub);
        if (!user?.refreshTokenHash || user.refreshTokenHash != this.hash(refreshToken)){
            throw new UnauthorizedException('Refresh token invalide');
        }

        return this.issueTokens(user);
    }
    
    async logout(userId: string){
        await this.users.setRefreshTokenHash(userId, null);
    }
}
