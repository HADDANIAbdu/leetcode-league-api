import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column() username: string;
    @Column({ unique: true }) email: string;
    @Column({ select: false }) passwordHash: string;
    @Column({ type: 'varchar', nullable: true, unique: true}) leetcodeUsername: string | null;
    @CreateDateColumn() createdAt: Date;
}