require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gycsl_db',
    multipleStatements: true
  });

  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  await db.query(fs.readFileSync(schemaPath, 'utf8'));
  console.log('Schema applied successfully.');
  await db.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
