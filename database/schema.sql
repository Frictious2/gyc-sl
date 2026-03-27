CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'editor') NOT NULL DEFAULT 'admin',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  last_login_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(120) NOT NULL UNIQUE,
  setting_value LONGTEXT NULL,
  setting_group VARCHAR(80) NOT NULL DEFAULT 'general',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS media_library (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  alt_text VARCHAR(255) NULL,
  file_size INT NULL,
  uploaded_by BIGINT UNSIGNED NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_media_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES admin_users(id)
);

CREATE TABLE IF NOT EXISTS pages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  route_path VARCHAR(220) NOT NULL UNIQUE,
  page_type VARCHAR(80) NOT NULL DEFAULT 'standard',
  hero_title VARCHAR(220) NULL,
  hero_subtitle TEXT NULL,
  hero_image_id BIGINT UNSIGNED NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_pages_published (is_published, status, sort_order),
  CONSTRAINT fk_pages_hero_image FOREIGN KEY (hero_image_id) REFERENCES media_library(id)
);

CREATE TABLE IF NOT EXISTS page_sections (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_id BIGINT UNSIGNED NOT NULL,
  section_key VARCHAR(120) NOT NULL,
  title VARCHAR(220) NULL,
  subtitle VARCHAR(255) NULL,
  body LONGTEXT NULL,
  image_id BIGINT UNSIGNED NULL,
  cta_label VARCHAR(120) NULL,
  cta_link VARCHAR(255) NULL,
  secondary_cta_label VARCHAR(120) NULL,
  secondary_cta_link VARCHAR(255) NULL,
  layout_style VARCHAR(80) NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_page_sections_page FOREIGN KEY (page_id) REFERENCES pages(id),
  CONSTRAINT fk_page_sections_image FOREIGN KEY (image_id) REFERENCES media_library(id),
  UNIQUE KEY uniq_page_section (page_id, section_key)
);

CREATE TABLE IF NOT EXISTS section_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  section_id BIGINT UNSIGNED NOT NULL,
  item_type VARCHAR(80) NOT NULL DEFAULT 'card',
  title VARCHAR(220) NULL,
  subtitle VARCHAR(255) NULL,
  body LONGTEXT NULL,
  meta_json JSON NULL,
  image_id BIGINT UNSIGNED NULL,
  link_label VARCHAR(120) NULL,
  link_url VARCHAR(255) NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_section_items_section FOREIGN KEY (section_id) REFERENCES page_sections(id),
  CONSTRAINT fk_section_items_image FOREIGN KEY (image_id) REFERENCES media_library(id)
);

CREATE TABLE IF NOT EXISTS section_media (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  section_id BIGINT UNSIGNED NOT NULL,
  media_id BIGINT UNSIGNED NOT NULL,
  media_role VARCHAR(80) NOT NULL DEFAULT 'gallery',
  caption VARCHAR(255) NULL,
  alt_text VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_section_media_section FOREIGN KEY (section_id) REFERENCES page_sections(id),
  CONSTRAINT fk_section_media_media FOREIGN KEY (media_id) REFERENCES media_library(id),
  UNIQUE KEY uniq_section_media (section_id, media_id, media_role)
);

CREATE TABLE IF NOT EXISTS programs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  short_description TEXT NULL,
  challenge_text LONGTEXT NULL,
  approach_text LONGTEXT NULL,
  key_activities LONGTEXT NULL,
  impact_highlights LONGTEXT NULL,
  featured_project_id BIGINT UNSIGNED NULL,
  hero_image_id BIGINT UNSIGNED NULL,
  accent_color VARCHAR(20) NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_programs_hero_image FOREIGN KEY (hero_image_id) REFERENCES media_library(id)
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  program_id BIGINT UNSIGNED NULL,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  summary TEXT NULL,
  body LONGTEXT NULL,
  theme VARCHAR(120) NULL,
  location VARCHAR(180) NULL,
  project_status ENUM('current', 'ongoing', 'completed') NOT NULL DEFAULT 'current',
  featured_image_id BIGINT UNSIGNED NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  partners_text TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_projects_program FOREIGN KEY (program_id) REFERENCES programs(id),
  CONSTRAINT fk_projects_featured_image FOREIGN KEY (featured_image_id) REFERENCES media_library(id)
);

CREATE TABLE IF NOT EXISTS partners (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  summary TEXT NULL,
  website_url VARCHAR(255) NULL,
  logo_media_id BIGINT UNSIGNED NULL,
  partner_type VARCHAR(80) NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_partners_logo FOREIGN KEY (logo_media_id) REFERENCES media_library(id)
);

CREATE TABLE IF NOT EXISTS team_members (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  role_title VARCHAR(180) NOT NULL,
  bio LONGTEXT NULL,
  photo_media_id BIGINT UNSIGNED NULL,
  email VARCHAR(150) NULL,
  linkedin_url VARCHAR(255) NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_team_photo FOREIGN KEY (photo_media_id) REFERENCES media_library(id)
);

CREATE TABLE IF NOT EXISTS board_members (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  role_title VARCHAR(180) NOT NULL,
  bio LONGTEXT NULL,
  photo_media_id BIGINT UNSIGNED NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_board_photo FOREIGN KEY (photo_media_id) REFERENCES media_library(id)
);

CREATE TABLE IF NOT EXISTS district_coordinators (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  district_name VARCHAR(180) NOT NULL,
  phone VARCHAR(80) NULL,
  email VARCHAR(150) NULL,
  bio LONGTEXT NULL,
  photo_media_id BIGINT UNSIGNED NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_district_photo FOREIGN KEY (photo_media_id) REFERENCES media_library(id)
);

CREATE TABLE IF NOT EXISTS news_posts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  category ENUM('news', 'events', 'press') NOT NULL DEFAULT 'news',
  excerpt TEXT NULL,
  body LONGTEXT NULL,
  featured_image_id BIGINT UNSIGNED NULL,
  published_at DATETIME NULL,
  author_name VARCHAR(180) NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_news_featured_image FOREIGN KEY (featured_image_id) REFERENCES media_library(id)
);

CREATE TABLE IF NOT EXISTS resources (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  category ENUM('publications', 'toolkits-guides', 'multimedia', 'external-resources') NOT NULL DEFAULT 'publications',
  summary TEXT NULL,
  file_media_id BIGINT UNSIGNED NULL,
  external_url VARCHAR(255) NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_resources_file FOREIGN KEY (file_media_id) REFERENCES media_library(id)
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  category VARCHAR(120) NULL,
  caption TEXT NULL,
  media_id BIGINT UNSIGNED NOT NULL,
  related_program_id BIGINT UNSIGNED NULL,
  related_project_id BIGINT UNSIGNED NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_gallery_media FOREIGN KEY (media_id) REFERENCES media_library(id),
  CONSTRAINT fk_gallery_program FOREIGN KEY (related_program_id) REFERENCES programs(id),
  CONSTRAINT fk_gallery_project FOREIGN KEY (related_project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(180) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(80) NULL,
  subject VARCHAR(180) NULL,
  message LONGTEXT NOT NULL,
  status ENUM('new', 'read', 'replied') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_contact_messages_status_created (status, created_at),
  INDEX idx_contact_messages_email_created (email, created_at)
);

CREATE TABLE IF NOT EXISTS volunteer_applications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(180) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(80) NULL,
  district VARCHAR(120) NULL,
  interests TEXT NULL,
  motivation LONGTEXT NULL,
  status ENUM('new', 'reviewed', 'shortlisted', 'closed') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS partnership_inquiries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  organisation_name VARCHAR(220) NOT NULL,
  contact_name VARCHAR(180) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(80) NULL,
  partnership_type VARCHAR(120) NULL,
  message LONGTEXT NULL,
  status ENUM('new', 'reviewed', 'in-discussion', 'closed') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  status ENUM('active', 'unsubscribed') NOT NULL DEFAULT 'active',
  source VARCHAR(120) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS donations_info (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  instructions LONGTEXT NOT NULL,
  bank_details LONGTEXT NULL,
  mobile_money_details LONGTEXT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS seo_meta (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  route_path VARCHAR(220) NULL,
  meta_title VARCHAR(255) NOT NULL,
  meta_description TEXT NULL,
  meta_keywords TEXT NULL,
  og_title VARCHAR(255) NULL,
  og_description TEXT NULL,
  og_image_id BIGINT UNSIGNED NULL,
  canonical_url VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uniq_seo_route (entity_type, route_path),
  CONSTRAINT fk_seo_og_image FOREIGN KEY (og_image_id) REFERENCES media_library(id)
);

ALTER TABLE contact_messages
  MODIFY COLUMN status ENUM('new', 'reviewed', 'responded', 'archived', 'read', 'replied') NOT NULL DEFAULT 'new';

UPDATE contact_messages SET status = 'read' WHERE status = 'reviewed';
UPDATE contact_messages SET status = 'replied' WHERE status = 'responded';
UPDATE contact_messages SET status = 'read' WHERE status = 'archived';

ALTER TABLE contact_messages
  MODIFY COLUMN status ENUM('new', 'read', 'replied') NOT NULL DEFAULT 'new';
