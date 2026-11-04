import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { League } from "../leagues/league.entity";
import { Week } from "../weeks/week.entity";
import { User } from "../users/user.entity";

export enum PotTxType { WEEKLY_STAKE = 'WEEKLY_STAKE', ADJUSTMENT = 'ADJUSTMENT' }

@Entity('pot_transactions')
export class PotTransaction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => League, { onDelete: 'CASCADE' }) league: League;
  @ManyToOne(() => Week, { nullable: true }) week: Week | null;
  @ManyToOne(() => User, { nullable: true }) user: User | null; // qui a payé
  @Column({ type: 'int' }) amount: number;
  @Column({ type: 'enum', enum: PotTxType }) type: PotTxType;
  @CreateDateColumn() createdAt: Date;
}
