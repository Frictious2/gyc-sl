const mysql = require('mysql2/promise');

const baseConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gycsl_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
  multipleStatements: true
};

const pool = mysql.createPool(baseConfig);

const sessionConfig = {
  host: baseConfig.host,
  port: baseConfig.port,
  user: baseConfig.user,
  password: baseConfig.password,
  database: baseConfig.database,
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 1000 * 60 * 60 * 8,
  createDatabaseTable: true
};

module.exports = {
  pool,
  sessionConfig,
  query: (sql, params = {}) => pool.execute(sql, params)
};
