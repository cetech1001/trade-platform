import dotenv from 'dotenv';
import path from "path";
dotenv.config();

export const environment = {
  production: false,
  port: process.env.PORT || 3000,
  db: {
    type: (process.env.DB_TYPE as 'mysql' | 'mariadb') || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
    extra: {
      decimalNumbers: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_TOKEN_EXPIRE || '1h',
  },
  assetsPath: path.join(process.cwd(), 'assets'),
}
