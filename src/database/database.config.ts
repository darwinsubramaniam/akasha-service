import { registerAs } from '@nestjs/config';

export default registerAs(`postgres`, () => ({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'akasha',
    logging: process.env.DB_LOGGING === `true`,
    schema: process.env.DB_SCHEMA || `public`,
    synchronize: process.env.DB_SYNC === `true` || true,
}))