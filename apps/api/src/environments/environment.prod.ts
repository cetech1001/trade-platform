import dotenv from 'dotenv';
import path from "path";
import process from 'node:process';
dotenv.config();

export const environment = {
  production: false,
  port: process.env.PORT || 3000,
  appName: process.env.NX_REACT_APP_SITE_NAME,
  webUrl: process.env.NX_REACT_APP_WEB_URL,
  adminUrl: process.env.NX_REACT_APP_ADMIN_URL,
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
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  supportEmail: process.env.SUPPORT_EMAIL,
  polygonAPI: process.env.POLYGON_API,
  alphaVantageAPIKey: process.env.ALPHA_VANTAGE_KEY,
  assetsPath: path.join(process.cwd(), 'assets'),
}
