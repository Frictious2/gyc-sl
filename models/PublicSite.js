const BaseModel = require('./BaseModel');

class PublicSite extends BaseModel {
  static async getPageByRoute(routePath) {
    const pages = await this.query(
      `SELECT p.id, p.title, p.slug, p.route_path, p.page_type, p.hero_title, p.hero_subtitle,
              p.hero_image_id, p.status, p.is_published,
              hero_media.file_path AS hero_image_path,
              hero_media.alt_text AS hero_image_alt
       FROM pages p
       LEFT JOIN media_library hero_media ON hero_media.id = p.hero_image_id
       WHERE p.route_path = :routePath
         AND p.deleted_at IS NULL
         AND p.is_published = 1
         AND p.status = 'published'
       LIMIT 1`,
      { routePath }
    );

    return pages[0] || null;
  }

  static async getSectionsByPageId(pageId) {
    return this.query(
      `SELECT ps.id, ps.section_key, ps.title, ps.subtitle, ps.body, ps.image_id,
              ps.cta_label, ps.cta_link, ps.secondary_cta_label, ps.secondary_cta_link,
              ps.layout_style, ps.is_published, ps.sort_order,
              media.file_path AS image_path,
              media.alt_text AS image_alt
       FROM page_sections ps
       LEFT JOIN media_library media ON media.id = ps.image_id
       WHERE ps.page_id = :pageId
         AND ps.deleted_at IS NULL
         AND ps.is_published = 1
         AND ps.status = 'published'
       ORDER BY ps.sort_order ASC, ps.id ASC`,
      { pageId }
    );
  }

  static async getSectionItems(sectionId) {
    return this.query(
      `SELECT si.id, si.item_type, si.title, si.subtitle, si.body, si.meta_json, si.link_label,
              si.link_url, si.sort_order, media.file_path AS image_path, media.alt_text AS image_alt
       FROM section_items si
       LEFT JOIN media_library media ON media.id = si.image_id
       WHERE si.section_id = :sectionId
         AND si.deleted_at IS NULL
         AND si.is_published = 1
         AND si.status = 'published'
       ORDER BY si.sort_order ASC, si.id ASC`,
      { sectionId }
    );
  }

  static async getSectionMedia(sectionId) {
    return this.query(
      `SELECT sm.id, sm.media_role, sm.caption, sm.alt_text, sm.sort_order,
              media.file_path, media.alt_text AS media_alt, media.title
       FROM section_media sm
       INNER JOIN media_library media ON media.id = sm.media_id
       WHERE sm.section_id = :sectionId
         AND sm.deleted_at IS NULL
       ORDER BY sm.sort_order ASC, sm.id ASC`,
      { sectionId }
    );
  }

  static async getPrograms() {
    return this.query(
      `SELECT p.*, media.file_path AS hero_image_path, media.alt_text AS hero_image_alt,
              pr.slug AS featured_project_slug, pr.title AS featured_project_title_resolved
       FROM programs p
       LEFT JOIN media_library media ON media.id = p.hero_image_id
       LEFT JOIN projects pr ON pr.id = p.featured_project_id
       WHERE p.deleted_at IS NULL
         AND p.is_published = 1
         AND p.status = 'published'
       ORDER BY p.sort_order ASC, p.id ASC`
    );
  }

  static async getProgramBySlug(slug) {
    const rows = await this.query(
      `SELECT p.*, media.file_path AS hero_image_path, media.alt_text AS hero_image_alt,
              pr.slug AS featured_project_slug, pr.title AS featured_project_title_resolved
       FROM programs p
       LEFT JOIN media_library media ON media.id = p.hero_image_id
       LEFT JOIN projects pr ON pr.id = p.featured_project_id
       WHERE p.slug = :slug
         AND p.deleted_at IS NULL
         AND p.is_published = 1
         AND p.status = 'published'
       LIMIT 1`,
      { slug }
    );

    return rows[0] || null;
  }

  static async getProjects() {
    return this.query(
      `SELECT p.*, media.file_path AS featured_image_path, media.alt_text AS featured_image_alt
       FROM projects p
       LEFT JOIN media_library media ON media.id = p.featured_image_id
       WHERE p.deleted_at IS NULL
         AND p.is_published = 1
         AND p.status = 'published'
       ORDER BY p.sort_order ASC, p.id ASC`
    );
  }

  static async getProjectBySlug(slug) {
    const rows = await this.query(
      `SELECT p.*, media.file_path AS featured_image_path, media.alt_text AS featured_image_alt
       FROM projects p
       LEFT JOIN media_library media ON media.id = p.featured_image_id
       WHERE p.slug = :slug
         AND p.deleted_at IS NULL
         AND p.is_published = 1
         AND p.status = 'published'
       LIMIT 1`,
      { slug }
    );

    return rows[0] || null;
  }

  static async getNews() {
    return this.query(
      `SELECT n.*, media.file_path AS featured_image_path, media.alt_text AS featured_image_alt
       FROM news_posts n
       LEFT JOIN media_library media ON media.id = n.featured_image_id
       WHERE n.deleted_at IS NULL
         AND n.status = 'published'
       ORDER BY COALESCE(n.published_at, n.created_at) DESC, n.id DESC`
    );
  }

  static async getNewsBySlug(slug) {
    const rows = await this.query(
      `SELECT n.*, media.file_path AS featured_image_path, media.alt_text AS featured_image_alt
       FROM news_posts n
       LEFT JOIN media_library media ON media.id = n.featured_image_id
       WHERE n.slug = :slug
         AND n.deleted_at IS NULL
         AND n.status = 'published'
       LIMIT 1`,
      { slug }
    );

    return rows[0] || null;
  }

  static async getResources() {
    return this.query(
      `SELECT r.*, media.file_path AS file_path_resolved, media.alt_text AS file_alt
       FROM resources r
       LEFT JOIN media_library media ON media.id = r.file_media_id
       WHERE r.deleted_at IS NULL
         AND r.status = 'published'
       ORDER BY r.sort_order ASC, r.id ASC`
    );
  }

  static async getGallery() {
    return this.query(
      `SELECT g.*, media.file_path, media.alt_text
       FROM gallery_items g
       INNER JOIN media_library media ON media.id = g.media_id
       WHERE g.deleted_at IS NULL
         AND g.status = 'published'
       ORDER BY g.sort_order ASC, g.id ASC`
    );
  }

  static async getPartners() {
    return this.query(
      `SELECT p.*, media.file_path AS logo_path, media.alt_text AS logo_alt
       FROM partners p
       LEFT JOIN media_library media ON media.id = p.logo_media_id
       WHERE p.deleted_at IS NULL
         AND p.status = 'published'
       ORDER BY p.sort_order ASC, p.id ASC`
    );
  }

  static async getTeam() {
    return this.query(
      `SELECT t.*, media.file_path AS photo_path, media.alt_text AS photo_alt
       FROM team_members t
       LEFT JOIN media_library media ON media.id = t.photo_media_id
       WHERE t.deleted_at IS NULL
         AND t.status = 'published'
       ORDER BY t.sort_order ASC, t.id ASC`
    );
  }

  static async getBoard() {
    return this.query(
      `SELECT b.*, media.file_path AS photo_path, media.alt_text AS photo_alt
       FROM board_members b
       LEFT JOIN media_library media ON media.id = b.photo_media_id
       WHERE b.deleted_at IS NULL
         AND b.status = 'published'
       ORDER BY b.sort_order ASC, b.id ASC`
    );
  }

  static async getDistrictCoordinators() {
    return this.query(
      `SELECT d.*, media.file_path AS photo_path, media.alt_text AS photo_alt
       FROM district_coordinators d
       LEFT JOIN media_library media ON media.id = d.photo_media_id
       WHERE d.deleted_at IS NULL
         AND d.status = 'published'
       ORDER BY d.sort_order ASC, d.id ASC`
    );
  }

  static async getSettingsByGroup(settingGroup) {
    return this.query(
      `SELECT setting_key, setting_value
       FROM site_settings
       WHERE setting_group = :settingGroup
         AND deleted_at IS NULL
         AND status = 'active'`,
      { settingGroup }
    );
  }

  static async getSeoByRoute(routePath) {
    const rows = await this.query(
      `SELECT meta_title, meta_description, meta_keywords, og_title, og_description, canonical_url,
              media.file_path AS og_image_path
       FROM seo_meta s
       LEFT JOIN media_library media ON media.id = s.og_image_id
       WHERE s.route_path = :routePath
         AND s.deleted_at IS NULL
       LIMIT 1`,
      { routePath }
    );

    return rows[0] || null;
  }
}

module.exports = PublicSite;
