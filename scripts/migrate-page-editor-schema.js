require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const requiredColumns = {
  media_library: [
    { name: 'title', sql: 'ALTER TABLE media_library ADD COLUMN title VARCHAR(180) NULL AFTER id' },
    { name: 'file_name', sql: 'ALTER TABLE media_library ADD COLUMN file_name VARCHAR(255) NOT NULL AFTER title' },
    { name: 'file_path', sql: 'ALTER TABLE media_library ADD COLUMN file_path VARCHAR(255) NOT NULL AFTER file_name' },
    { name: 'mime_type', sql: 'ALTER TABLE media_library ADD COLUMN mime_type VARCHAR(120) NOT NULL AFTER file_path' },
    { name: 'alt_text', sql: 'ALTER TABLE media_library ADD COLUMN alt_text VARCHAR(255) NULL AFTER mime_type' },
    { name: 'file_size', sql: 'ALTER TABLE media_library ADD COLUMN file_size INT NULL AFTER alt_text' },
    { name: 'status', sql: "ALTER TABLE media_library ADD COLUMN status ENUM('active','inactive') NOT NULL DEFAULT 'active' AFTER uploaded_by" },
    { name: 'created_at', sql: 'ALTER TABLE media_library ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER status' },
    { name: 'updated_at', sql: 'ALTER TABLE media_library ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at' },
    { name: 'deleted_at', sql: 'ALTER TABLE media_library ADD COLUMN deleted_at DATETIME NULL AFTER updated_at' }
  ],
  pages: [
    { name: 'slug', sql: "ALTER TABLE pages ADD COLUMN slug VARCHAR(180) NOT NULL DEFAULT '' AFTER title" },
    { name: 'route_path', sql: "ALTER TABLE pages ADD COLUMN route_path VARCHAR(220) NOT NULL DEFAULT '' AFTER slug" },
    { name: 'page_type', sql: "ALTER TABLE pages ADD COLUMN page_type VARCHAR(80) NOT NULL DEFAULT 'standard' AFTER route_path" },
    { name: 'hero_title', sql: 'ALTER TABLE pages ADD COLUMN hero_title VARCHAR(220) NULL AFTER page_type' },
    { name: 'hero_subtitle', sql: 'ALTER TABLE pages ADD COLUMN hero_subtitle TEXT NULL AFTER hero_title' },
    { name: 'hero_image_id', sql: 'ALTER TABLE pages ADD COLUMN hero_image_id BIGINT UNSIGNED NULL AFTER hero_subtitle' },
    { name: 'status', sql: "ALTER TABLE pages ADD COLUMN status ENUM('draft','published','archived') NOT NULL DEFAULT 'published' AFTER hero_image_id" },
    { name: 'is_published', sql: 'ALTER TABLE pages ADD COLUMN is_published TINYINT(1) NOT NULL DEFAULT 1 AFTER status' },
    { name: 'sort_order', sql: 'ALTER TABLE pages ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER is_published' },
    { name: 'created_at', sql: 'ALTER TABLE pages ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER sort_order' },
    { name: 'updated_at', sql: 'ALTER TABLE pages ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at' },
    { name: 'deleted_at', sql: 'ALTER TABLE pages ADD COLUMN deleted_at DATETIME NULL AFTER updated_at' }
  ],
  page_sections: [
    { name: 'section_key', sql: "ALTER TABLE page_sections ADD COLUMN section_key VARCHAR(120) NOT NULL DEFAULT '' AFTER page_id" },
    { name: 'title', sql: 'ALTER TABLE page_sections ADD COLUMN title VARCHAR(220) NULL AFTER section_key' },
    { name: 'subtitle', sql: 'ALTER TABLE page_sections ADD COLUMN subtitle VARCHAR(255) NULL AFTER title' },
    { name: 'body', sql: 'ALTER TABLE page_sections ADD COLUMN body LONGTEXT NULL AFTER subtitle' },
    { name: 'image_id', sql: 'ALTER TABLE page_sections ADD COLUMN image_id BIGINT UNSIGNED NULL AFTER body' },
    { name: 'cta_label', sql: 'ALTER TABLE page_sections ADD COLUMN cta_label VARCHAR(120) NULL AFTER image_id' },
    { name: 'cta_link', sql: 'ALTER TABLE page_sections ADD COLUMN cta_link VARCHAR(255) NULL AFTER cta_label' },
    { name: 'secondary_cta_label', sql: 'ALTER TABLE page_sections ADD COLUMN secondary_cta_label VARCHAR(120) NULL AFTER cta_link' },
    { name: 'secondary_cta_link', sql: 'ALTER TABLE page_sections ADD COLUMN secondary_cta_link VARCHAR(255) NULL AFTER secondary_cta_label' },
    { name: 'layout_style', sql: 'ALTER TABLE page_sections ADD COLUMN layout_style VARCHAR(80) NULL AFTER secondary_cta_link' },
    { name: 'status', sql: "ALTER TABLE page_sections ADD COLUMN status ENUM('draft','published','archived') NOT NULL DEFAULT 'published' AFTER layout_style" },
    { name: 'is_published', sql: 'ALTER TABLE page_sections ADD COLUMN is_published TINYINT(1) NOT NULL DEFAULT 1 AFTER status' },
    { name: 'sort_order', sql: 'ALTER TABLE page_sections ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER is_published' },
    { name: 'created_at', sql: 'ALTER TABLE page_sections ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER sort_order' },
    { name: 'updated_at', sql: 'ALTER TABLE page_sections ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at' },
    { name: 'deleted_at', sql: 'ALTER TABLE page_sections ADD COLUMN deleted_at DATETIME NULL AFTER updated_at' }
  ],
  section_items: [
    { name: 'item_type', sql: "ALTER TABLE section_items ADD COLUMN item_type VARCHAR(80) NOT NULL DEFAULT 'card' AFTER section_id" },
    { name: 'title', sql: 'ALTER TABLE section_items ADD COLUMN title VARCHAR(220) NULL AFTER item_type' },
    { name: 'subtitle', sql: 'ALTER TABLE section_items ADD COLUMN subtitle VARCHAR(255) NULL AFTER title' },
    { name: 'body', sql: 'ALTER TABLE section_items ADD COLUMN body LONGTEXT NULL AFTER subtitle' },
    { name: 'meta_json', sql: 'ALTER TABLE section_items ADD COLUMN meta_json LONGTEXT NULL AFTER body' },
    { name: 'image_id', sql: 'ALTER TABLE section_items ADD COLUMN image_id BIGINT UNSIGNED NULL AFTER meta_json' },
    { name: 'link_label', sql: 'ALTER TABLE section_items ADD COLUMN link_label VARCHAR(120) NULL AFTER image_id' },
    { name: 'link_url', sql: 'ALTER TABLE section_items ADD COLUMN link_url VARCHAR(255) NULL AFTER link_label' },
    { name: 'status', sql: "ALTER TABLE section_items ADD COLUMN status ENUM('draft','published','archived') NOT NULL DEFAULT 'published' AFTER link_url" },
    { name: 'is_published', sql: 'ALTER TABLE section_items ADD COLUMN is_published TINYINT(1) NOT NULL DEFAULT 1 AFTER status' },
    { name: 'sort_order', sql: 'ALTER TABLE section_items ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER is_published' },
    { name: 'created_at', sql: 'ALTER TABLE section_items ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER sort_order' },
    { name: 'updated_at', sql: 'ALTER TABLE section_items ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at' },
    { name: 'deleted_at', sql: 'ALTER TABLE section_items ADD COLUMN deleted_at DATETIME NULL AFTER updated_at' }
  ],
  section_media: [
    { name: 'media_role', sql: "ALTER TABLE section_media ADD COLUMN media_role VARCHAR(80) NOT NULL DEFAULT 'gallery' AFTER media_id" },
    { name: 'caption', sql: 'ALTER TABLE section_media ADD COLUMN caption VARCHAR(255) NULL AFTER media_role' },
    { name: 'alt_text', sql: 'ALTER TABLE section_media ADD COLUMN alt_text VARCHAR(255) NULL AFTER caption' },
    { name: 'sort_order', sql: 'ALTER TABLE section_media ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER alt_text' },
    { name: 'created_at', sql: 'ALTER TABLE section_media ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER sort_order' },
    { name: 'updated_at', sql: 'ALTER TABLE section_media ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at' },
    { name: 'deleted_at', sql: 'ALTER TABLE section_media ADD COLUMN deleted_at DATETIME NULL AFTER updated_at' }
  ],
  seo_meta: [
    { name: 'route_path', sql: 'ALTER TABLE seo_meta ADD COLUMN route_path VARCHAR(220) NULL AFTER entity_id' },
    { name: 'meta_title', sql: 'ALTER TABLE seo_meta ADD COLUMN meta_title VARCHAR(255) NOT NULL DEFAULT \'\' AFTER route_path' },
    { name: 'meta_description', sql: 'ALTER TABLE seo_meta ADD COLUMN meta_description TEXT NULL AFTER meta_title' },
    { name: 'meta_keywords', sql: 'ALTER TABLE seo_meta ADD COLUMN meta_keywords TEXT NULL AFTER meta_description' }
  ],
  site_settings: [
    { name: 'setting_group', sql: "ALTER TABLE site_settings ADD COLUMN setting_group VARCHAR(80) NOT NULL DEFAULT 'general' AFTER setting_value" },
    { name: 'status', sql: "ALTER TABLE site_settings ADD COLUMN status ENUM('active','inactive') NOT NULL DEFAULT 'active' AFTER setting_group" },
    { name: 'created_at', sql: 'ALTER TABLE site_settings ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER status' },
    { name: 'updated_at', sql: 'ALTER TABLE site_settings ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at' },
    { name: 'deleted_at', sql: 'ALTER TABLE site_settings ADD COLUMN deleted_at DATETIME NULL AFTER updated_at' }
  ]
};

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gycsl_db',
    multipleStatements: true
  });

  try {
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await db.query(schemaSql);

    for (const [tableName, columns] of Object.entries(requiredColumns)) {
      const [tableRows] = await db.execute(
        `SELECT COUNT(*) AS total
         FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = ?`,
        [tableName]
      );

      if (!tableRows[0]?.total) {
        console.warn(`Skipping ${tableName}: table does not exist after base schema run.`);
        continue;
      }

      for (const column of columns) {
        const [columnRows] = await db.execute(
          `SELECT COUNT(*) AS total
           FROM information_schema.COLUMNS
           WHERE TABLE_SCHEMA = DATABASE()
             AND TABLE_NAME = ?
             AND COLUMN_NAME = ?`,
          [tableName, column.name]
        );

        if (!columnRows[0]?.total) {
          console.log(`Adding ${tableName}.${column.name}`);
          await db.query(column.sql);
        }
      }
    }

    console.log('Page editor migration completed successfully.');
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
