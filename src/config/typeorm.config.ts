import 'dotenv/config'
import { DataSource, DataSourceOptions} from 'typeorm';
import { User } from '../users/user.entity';
import { League } from '../leagues/league.entity';
import { Membership } from '../leagues/membership.entity';
import { Week } from '../weeks/week.entity';
import { DailyProblem } from '../problems/daily-problem.entity';
import { DailyEntry } from '../entries/daily-entry.entity';
import { PotTransaction } from '../pot/pot-transaction.entity';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    entities: [User, League, Membership, Week, DailyProblem, DailyEntry, PotTransaction],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
};

export default new DataSource(dataSourceOptions);