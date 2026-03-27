require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const seedData = require('./seed-data');

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
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await db.query(schemaSql);

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeMe123!', 10);

  await db.execute(
    `INSERT INTO admin_users (full_name, email, password_hash, role, status)
     VALUES (?, ?, ?, 'super_admin', 'active')
     ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash), status = 'active'`,
    ['Super Admin', process.env.ADMIN_EMAIL || 'admin@gycsl.org', passwordHash]
  );

  for (const page of seedData.pages) {
    const [pageResult] = await db.execute(
      `INSERT INTO pages (title, slug, route_path, page_type, hero_title, hero_subtitle, status, is_published, sort_order)
       VALUES (?, ?, ?, 'standard', ?, ?, 'published', 1, 0)
       ON DUPLICATE KEY UPDATE title = VALUES(title), hero_title = VALUES(hero_title), hero_subtitle = VALUES(hero_subtitle)`,
      [
        page.title,
        page.route_path === '/' ? 'home' : page.route_path.replace(/^\//, '').replace(/\//g, '-'),
        page.route_path,
        page.hero_title,
        page.hero_subtitle
      ]
    );

    const [[savedPage]] = await db.execute('SELECT id FROM pages WHERE route_path = ? LIMIT 1', [page.route_path]);
    const pageId = savedPage.id || pageResult.insertId;

    for (const section of page.sections) {
      await db.execute(
        `INSERT INTO page_sections (
          page_id, section_key, title, subtitle, body, cta_label, cta_link,
          secondary_cta_label, secondary_cta_link, layout_style, status, is_published, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 1, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          subtitle = VALUES(subtitle),
          body = VALUES(body),
          cta_label = VALUES(cta_label),
          cta_link = VALUES(cta_link),
          secondary_cta_label = VALUES(secondary_cta_label),
          secondary_cta_link = VALUES(secondary_cta_link),
          layout_style = VALUES(layout_style),
          sort_order = VALUES(sort_order)`,
        [
          pageId,
          section.section_key,
          section.title || null,
          section.subtitle || null,
          section.body || null,
          section.cta_label || null,
          section.cta_link || null,
          section.secondary_cta_label || null,
          section.secondary_cta_link || null,
          section.layout_style || null,
          section.sort_order || 0
        ]
      );
    }
  }

  for (const [routePath, meta] of Object.entries(seedData.seo)) {
    if (routePath === 'default') {
      continue;
    }

    await db.execute(
      `INSERT INTO seo_meta (entity_type, route_path, meta_title, meta_description, meta_keywords)
       VALUES ('page', ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         meta_title = VALUES(meta_title),
         meta_description = VALUES(meta_description),
         meta_keywords = VALUES(meta_keywords)`,
      [routePath, meta.title, meta.description || '', meta.keywords || '']
    );
  }

  for (const program of seedData.programs) {
    await db.execute(
      `INSERT INTO programs (title, slug, short_description, challenge_text, approach_text, key_activities, impact_highlights, accent_color, status, is_published, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 1, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         short_description = VALUES(short_description),
         challenge_text = VALUES(challenge_text),
         approach_text = VALUES(approach_text),
         key_activities = VALUES(key_activities),
         impact_highlights = VALUES(impact_highlights),
         accent_color = VALUES(accent_color),
         sort_order = VALUES(sort_order)`,
      [
        program.title,
        program.slug,
        program.short_description,
        program.challenge_text,
        program.approach_text,
        program.key_activities,
        program.impact_highlights,
        program.accent_color,
        program.sort_order
      ]
    );
  }

  for (const project of seedData.projects) {
    await db.execute(
      `INSERT INTO projects (title, slug, summary, body, theme, location, project_status, status, is_published, partners_text, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'published', 1, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         summary = VALUES(summary),
         body = VALUES(body),
         theme = VALUES(theme),
         location = VALUES(location),
         project_status = VALUES(project_status),
         partners_text = VALUES(partners_text),
         sort_order = VALUES(sort_order)`,
      [
        project.title,
        project.slug,
        project.summary,
        project.body,
        project.theme,
        project.location,
        project.project_status,
        project.partners_text || null,
        project.sort_order
      ]
    );
  }

  for (const post of seedData.news) {
    await db.execute(
      `INSERT INTO news_posts (title, slug, category, excerpt, body, published_at, author_name, status, is_featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         excerpt = VALUES(excerpt),
         body = VALUES(body),
         published_at = VALUES(published_at),
         author_name = VALUES(author_name),
         is_featured = VALUES(is_featured),
         sort_order = VALUES(sort_order)`,
      [
        post.title,
        post.slug,
        post.category,
        post.excerpt,
        post.body,
        post.published_at,
        post.author_name,
        post.is_featured || 0,
        post.sort_order || 0
      ]
    );
  }

  for (const resource of seedData.resources) {
    await db.execute(
      `INSERT INTO resources (title, slug, category, summary, status, sort_order)
       VALUES (?, ?, ?, ?, 'published', ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         category = VALUES(category),
         summary = VALUES(summary),
         sort_order = VALUES(sort_order)`,
      [resource.title, resource.slug, resource.category, resource.summary, resource.sort_order]
    );
  }

  for (const partner of seedData.partners) {
    await db.execute(
      `INSERT INTO partners (name, slug, partner_type, status, sort_order)
       VALUES (?, ?, ?, 'published', ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         partner_type = VALUES(partner_type),
         sort_order = VALUES(sort_order)`,
      [partner.name, partner.slug, partner.partner_type, partner.sort_order]
    );
  }

  for (const member of seedData.team) {
    await db.execute(
      `INSERT INTO team_members (full_name, slug, role_title, bio, email, linkedin_url, status, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, 'published', ?)
       ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         role_title = VALUES(role_title),
         bio = VALUES(bio),
         email = VALUES(email),
         linkedin_url = VALUES(linkedin_url),
         sort_order = VALUES(sort_order)`,
      [member.full_name, member.slug, member.role_title, member.bio, member.email || null, member.linkedin_url || null, member.sort_order]
    );
  }

  for (const member of seedData.board) {
    await db.execute(
      `INSERT INTO board_members (full_name, slug, role_title, bio, status, sort_order)
       VALUES (?, ?, ?, ?, 'published', ?)
       ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         role_title = VALUES(role_title),
         bio = VALUES(bio),
         sort_order = VALUES(sort_order)`,
      [member.full_name, member.slug, member.role_title, member.bio, member.sort_order]
    );
  }

  for (const district of seedData.districts) {
    await db.execute(
      `INSERT INTO district_coordinators (full_name, slug, district_name, status, sort_order)
       VALUES (?, ?, ?, 'published', ?)
       ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         district_name = VALUES(district_name),
         sort_order = VALUES(sort_order)`,
      [district.full_name, district.slug, district.district_name, district.sort_order]
    );
  }

  const [[donationRecord]] = await db.execute('SELECT id FROM donations_info ORDER BY id ASC LIMIT 1');

  if (donationRecord) {
    await db.execute(
      `UPDATE donations_info
       SET title = ?, instructions = ?, bank_details = ?, mobile_money_details = ?, status = 'published'
       WHERE id = ?`,
      [
        seedData.donationInfo.title,
        seedData.donationInfo.instructions,
        seedData.donationInfo.bank_details,
        seedData.donationInfo.mobile_money_details,
        donationRecord.id
      ]
    );
  } else {
    await db.execute(
      `INSERT INTO donations_info (title, instructions, bank_details, mobile_money_details, status)
       VALUES (?, ?, ?, ?, 'published')`,
      [
        seedData.donationInfo.title,
        seedData.donationInfo.instructions,
        seedData.donationInfo.bank_details,
        seedData.donationInfo.mobile_money_details
      ]
    );
  }

  for (const [settingKey, settingValue] of Object.entries(seedData.contactSettings)) {
    await db.execute(
      `INSERT INTO site_settings (setting_key, setting_value, setting_group, status)
       VALUES (?, ?, 'contact', 'active')
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), status = 'active'`,
      [settingKey, settingValue]
    );
  }

  for (const [settingKey, settingValue] of Object.entries(seedData.footerSettings || {})) {
    await db.execute(
      `INSERT INTO site_settings (setting_key, setting_value, setting_group, status)
       VALUES (?, ?, 'footer', 'active')
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), status = 'active'`,
      [settingKey, settingValue]
    );
  }

  console.log('Database schema applied and seeded from the official GYC content document.');
  await db.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
