import { Entity, Unique, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "../users/user.entity";
import { Week } from "../weeks/week.entity";
import { DailyProblem } from "../problems/daily-problem.entity";

export enum EntrySource { MANUAL = 'MANUAL', AUTO = 'AUTO'}

@Entity('daily_entries')
@Unique(['user', 'problem'])
export class DailyEntry {
    @PrimaryGeneratedColumn('uuid') id: string;
    @ManyToOne(() => Week, {nullable: false, onDelete: 'CASCADE'}) week: Week;
    @ManyToOne(() => User, {nullable: false, onDelete: 'CASCADE'}) user: User;
    @ManyToOne(() => DailyProblem, {nullable: false, onDelete: 'CASCADE'}) problem: DailyProblem;
    @Column({default: false}) solved: boolean;
    @Column({ type: 'timestamptz', nullable: true }) solvedAt: Date | null;
    @Column({ type: 'int', default: 0 }) points: number;
    @Column({ type: 'enum', enum: EntrySource, default: EntrySource.MANUAL }) source: EntrySource;
}