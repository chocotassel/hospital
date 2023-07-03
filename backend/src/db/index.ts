// db()
import { Sequelize } from 'sequelize-typescript';
import config from '../config';
import path from 'path';
import { dbLogger } from '../common/logger';

const sequelize = new Sequelize(config.databaseConfig.database as string, config.databaseConfig.username as string, config.databaseConfig.password, {
  host: config.databaseConfig.host,
  port: config.databaseConfig.port,
  dialect: 'mysql',
  logging: msg => dbLogger.info(msg),
  define: {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
  models: [path.join(__dirname, '..', 'models', '*.{ts,js}')],
});
// import './seed'

const db =  async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // // 同步所有定义的模型到数据库中
    // await sequelize.sync();
    // console.log('All models were synchronized successfully.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
}

export default db;
