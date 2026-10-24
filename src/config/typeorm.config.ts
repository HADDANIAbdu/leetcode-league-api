import 'dotenv/config'
import { DataSource, DataSourceOptions} from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    entities: [__dirname + '/../**/*.entity{.ts, .js}'],
    migrations: [__dirname + '/../migrations/*{.ts, .js}'],
    synchronize: false,
};

export default new DataSource(dataSourceOptions);