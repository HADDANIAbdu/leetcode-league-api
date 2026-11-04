import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity('leagues')
export class League {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column() name: string;
    @Column({unique: true}) inviteCode: string;
    @Column({default: 10}) weeklyStake: number;
    @Column({default: 'MAD'}) currency: string;
    @CreateDateColumn() createdAt: Date;
}