import { Entity, Unique, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { League } from "../leagues/league.entity";

@Entity('daily_problems')
@Unique(['league', 'date'])
export class DailyProblem {
    @PrimaryGeneratedColumn('uuid') id: string;
    @ManyToOne(() => League, { nullable: false, onDelete: 'CASCADE' }) league: League;
    @Column({ type: 'date' }) date: string;
    @Column({ type: 'timestamptz' }) postedAt: Date;
    @Column({ type: 'varchar', nullable: true }) title: string | null;
    @Column({ type: 'varchar', nullable: true }) url: string | null;
}