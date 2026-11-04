import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { League } from "../leagues/league.entity";


export enum WeekStatus { OPEN = 'OPEN', CLOSED = 'CLOSED'}

@Entity('weeks')
@Unique(['league', 'weekNumber'])
export class Week {
    @PrimaryGeneratedColumn('uuid') id: string;
    @ManyToOne(() => League, {nullable: false, onDelete:'CASCADE'}) league: League;
    @Column() weekNumber: number;
    @Column({type: 'date'}) startDate: string;
    @Column({type: 'enum', enum: WeekStatus, default: WeekStatus.OPEN}) status: WeekStatus;
    @Column({type: 'timestamptz'}) closedAt: Date | null;
}