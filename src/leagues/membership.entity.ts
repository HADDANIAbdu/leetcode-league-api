import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from "typeorm";
import { User } from "../users/user.entity";
import { League } from "./league.entity";

export enum MemberRole { OWNER = 'OWNER', MEMBER = 'MEMBER'}

@Entity('Memberships')
@Unique(['user', 'league'])
export class Membership {
    @PrimaryGeneratedColumn('uuid') id: string;
    @ManyToOne(() => User, {onDelete: 'CASCADE', nullable: false}) user: User;
    @ManyToOne(() => League, {onDelete: 'CASCADE', nullable: false}) league: League;
    @Column({type: 'enum', enum: MemberRole, default:MemberRole.MEMBER}) role: MemberRole;
    @CreateDateColumn() joinedAt: Date;
}   