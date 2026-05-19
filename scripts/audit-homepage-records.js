require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gycsl_db'
  });

  const [pages] = await db.execute(
    `SELECT p.id, p.title, p.slug, p.route_path, p.page_type, p.status, p.is_published, p.updated_at,
            COUNT(ps.id) AS section_count
     FROM pages p
     LEFT JOIN page_sections ps
       ON ps.page_id = p.id
      AND ps.deleted_at IS NULL
     WHERE p.deleted_at IS NULL
       AND (
         p.slug IN ('home', 'index', '/', '')
         OR p.route_path IN ('/', '', 'home', '/home', 'index')
         OR p.page_type = 'home'
       )
     GROUP BY p.id, p.title, p.slug, p.route_path, p.page_type, p.status, p.is_published, p.updated_at
     ORDER BY
       CASE
         WHEN p.slug = 'home' THEN 0
         WHEN p.page_type = 'home' THEN 1
         WHEN p.route_path = '/' THEN 2
         WHEN p.route_path = '' THEN 3
         WHEN p.route_path = 'home' THEN 4
         WHEN p.route_path = '/home' THEN 5
         WHEN p.route_path = 'index' THEN 6
         ELSE 99
       END,
       p.updated_at DESC,
       p.id ASC`
  );

  console.log(JSON.stringify({ homeCandidates: pages }, null, 2));
  await db.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
