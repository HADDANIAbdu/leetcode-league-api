import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}
    
    findById(id: string) { return this.repo.findOneBy({ id });}

    findByEmailWithPassword(email: string){
        return this.repo.findOne({
            where: { email },
            select: { id: true, email: true, username: true, passwordHash: true},
        });
    }

    create(data: Partial<User>){
        return this.repo.save(this.repo.create(data));
    }

    setRefreshTokenHash(id: string, hash: string | null){
        return this.repo.update(id, { refreshTokenHash: hash});
    }

    findByIdWithRefreshHash(id: string){
        return this.repo.findOne({
            where: { id },
            select: { id: true, email: true, refreshTokenHash: true },
        });
    }
}
