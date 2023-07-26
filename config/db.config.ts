import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ConfigValidator: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  username: 'postgres', //process.env.PG_USERNAME,
  password: 'ship99', //process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
