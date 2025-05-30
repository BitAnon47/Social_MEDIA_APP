import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
  }
};

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    logging: config.development.logging
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ DB connected successfully'))
  .catch(err => console.error('❌ DB connection failed:', err));

export { sequelize };
export default config;
