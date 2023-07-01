const loggerConfig = {
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: 'logs/cheese.log' },
    access: { type: 'dateFile', filename: 'logs/access.log' },
    db: { type: 'dateFile', filename: 'logs/db.log' },
  },
  categories: {
    default: { appenders: ['console'], level: 'info' },
    file: { appenders: ['file'], level: 'info' },
    access: { appenders: ['access'], level: 'info' },
    db: { appenders: ['db'], level: 'info' },
  },
};

export default loggerConfig;
