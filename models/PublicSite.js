const BaseModel = require('./BaseModel');
const SchemaInspector = require('./SchemaInspector');

function groupRowsBySection(rows) {
  return rows.reduce((acc, row) => {
    const key = row.section_id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {});
}

class PublicSite extends BaseModel {
  static async getPageByRoute(routePath) {
    const [pageColumns, mediaColumns] = await Promise.all([
      SchemaInspector.getColumns('pages'),
      SchemaInspector.getColumns('media_library')
    ]);

    const pages = await this.query(
      `SELECT ${[
        'p.id',
        'p.title',
        pageColumns.has('slug') ? 'p.slug' : "'' AS slug",
        pageColumns.has('route_path') ? 'p.route_path' : "'' AS route_path",
        pageColumns.has('page_type') ? 'p.page_type' : "'standard' AS page_type",
        pageColumns.has('hero_title') ? 'p.hero_title' : 'NULL AS hero_title',
        pageColumns.has('hero_subtitle') ? 'p.hero_subtitle' : 'NULL AS hero_subtitle',
        pageColumns.has('hero_image_id') ? 'p.hero_image_id' : 'NULL AS hero_image_id',
        pageColumns.has('status') ? 'p.status' : "'published' AS status",
        pageColumns.has('is_published') ? 'p.is_published' : '1 AS is_published',
        mediaColumns.has('file_path') ? 'hero_media.file_path AS hero_image_path' : 'NULL AS hero_image_path',
        mediaColumns.has('alt_text') ? 'hero_media.alt_text AS hero_image_alt' : 'NULL AS hero_image_alt'
      ].join(', ')}
       FROM pages p
       LEFT JOIN media_library hero_media ON hero_media.id = p.hero_image_id ${mediaColumns.has('deleted_at') ? 'AND hero_media.deleted_at IS NULL' : ''}
       WHERE p.route_path = :routePath
         ${pageColumns.has('deleted_at') ? 'AND p.deleted_at IS NULL' : ''}
         ${pageColumns.has('is_published') ? 'AND p.is_published = 1' : ''}
         ${pageColumns.has('status') ? "AND p.status = 'published'" : ''}
       LIMIT 1`,
      { routePath }
    );

    return pages[0] || null;
  }

  static async getSectionsByPageId(pageId) {
    const [sectionColumns, mediaColumns] = await Promise.all([
      SchemaInspector.getColumns('page_sections'),
      SchemaInspector.getColumns('media_library')
    ]);

    return this.query(
      `SELECT ${[
        'ps.id',
        sectionColumns.has('section_key') ? 'ps.section_key' : "CONCAT('section-', ps.id) AS section_key",
        sectionColumns.has('title') ? 'ps.title' : 'NULL AS title',
        sectionColumns.has('subtitle') ? 'ps.subtitle' : 'NULL AS subtitle',
        sectionColumns.has('body') ? 'ps.body' : 'NULL AS body',
        sectionColumns.has('image_id') ? 'ps.image_id' : 'NULL AS image_id',
        sectionColumns.has('cta_label') ? 'ps.cta_label' : 'NULL AS cta_label',
        sectionColumns.has('cta_link') ? 'ps.cta_link' : 'NULL AS cta_link',
        sectionColumns.has('secondary_cta_label') ? 'ps.secondary_cta_label' : 'NULL AS secondary_cta_label',
        sectionColumns.has('secondary_cta_link') ? 'ps.secondary_cta_link' : 'NULL AS secondary_cta_link',
        sectionColumns.has('layout_style') ? 'ps.layout_style' : 'NULL AS layout_style',
        sectionColumns.has('is_published') ? 'ps.is_published' : '1 AS is_published',
        sectionColumns.has('sort_order') ? 'ps.sort_order' : '0 AS sort_order',
        mediaColumns.has('file_path') ? 'media.file_path AS image_path' : 'NULL AS image_path',
        mediaColumns.has('alt_text') ? 'media.alt_text AS image_alt' : 'NULL AS image_alt'
      ].join(', ')}
       FROM page_sections ps
       LEFT JOIN media_library media ON media.id = ps.image_id ${mediaColumns.has('deleted_at') ? 'AND media.deleted_at IS NULL' : ''}
       WHERE ps.page_id = :pageId
         ${sectionColumns.has('deleted_at') ? 'AND ps.deleted_at IS NULL' : ''}
         ${sectionColumns.has('is_published') ? 'AND ps.is_published = 1' : ''}
         ${sectionColumns.has('status') ? "AND ps.status = 'published'" : ''}
       ORDER BY ${sectionColumns.has('sort_order') ? 'ps.sort_order ASC,' : ''} ps.id ASC`,
      { pageId }
    );
  }

  static async getSectionItems(sectionId) {
    const [itemColumns, mediaColumns] = await Promise.all([
      SchemaInspector.getColumns('section_items'),
      SchemaInspector.getColumns('media_library')
    ]);

    return this.query(
      `SELECT ${[
        'si.id',
        itemColumns.has('item_type') ? 'si.item_type' : "'card' AS item_type",
        itemColumns.has('title') ? 'si.title' : 'NULL AS title',
        itemColumns.has('subtitle') ? 'si.subtitle' : 'NULL AS subtitle',
        itemColumns.has('body') ? 'si.body' : 'NULL AS body',
        itemColumns.has('meta_json') ? 'si.meta_json' : 'NULL AS meta_json',
        itemColumns.has('link_label') ? 'si.link_label' : 'NULL AS link_label',
        itemColumns.has('link_url') ? 'si.link_url' : 'NULL AS link_url',
        itemColumns.has('sort_order') ? 'si.sort_order' : '0 AS sort_order',
        mediaColumns.has('file_path') ? 'media.file_path AS image_path' : 'NULL AS image_path',
        mediaColumns.has('alt_text') ? 'media.alt_text AS image_alt' : 'NULL AS image_alt'
      ].join(', ')}
       FROM section_items si
       LEFT JOIN media_library media ON media.id = si.image_id ${mediaColumns.has('deleted_at') ? 'AND media.deleted_at IS NULL' : ''}
       WHERE si.section_id = :sectionId
         ${itemColumns.has('deleted_at') ? 'AND si.deleted_at IS NULL' : ''}
         ${itemColumns.has('is_published') ? 'AND si.is_published = 1' : ''}
         ${itemColumns.has('status') ? "AND si.status = 'published'" : ''}
       ORDER BY ${itemColumns.has('sort_order') ? 'si.sort_order ASC,' : ''} si.id ASC`,
      { sectionId }
    );
  }

  static async getSectionItemsBySectionIds(sectionIds) {
    if (!Array.isArray(sectionIds) || !sectionIds.length) {
      return {};
    }

    const [itemColumns, mediaColumns] = await Promise.all([
      SchemaInspector.getColumns('section_items'),
      SchemaInspector.getColumns('media_library')
    ]);
    const sectionIdList = sectionIds.join(', ');

    const rows = await this.query(
      `SELECT ${[
        'si.section_id',
        'si.id',
        itemColumns.has('item_type') ? 'si.item_type' : "'card' AS item_type",
        itemColumns.has('title') ? 'si.title' : 'NULL AS title',
        itemColumns.has('subtitle') ? 'si.subtitle' : 'NULL AS subtitle',
        itemColumns.has('body') ? 'si.body' : 'NULL AS body',
        itemColumns.has('meta_json') ? 'si.meta_json' : 'NULL AS meta_json',
        itemColumns.has('link_label') ? 'si.link_label' : 'NULL AS link_label',
        itemColumns.has('link_url') ? 'si.link_url' : 'NULL AS link_url',
        itemColumns.has('sort_order') ? 'si.sort_order' : '0 AS sort_order',
        mediaColumns.has('file_path') ? 'media.file_path AS image_path' : 'NULL AS image_path',
        mediaColumns.has('alt_text') ? 'media.alt_text AS image_alt' : 'NULL AS image_alt'
      ].join(', ')}
       FROM section_items si
       LEFT JOIN media_library media ON media.id = si.image_id ${mediaColumns.has('deleted_at') ? 'AND media.deleted_at IS NULL' : ''}
       WHERE si.section_id IN (${sectionIdList})
         ${itemColumns.has('deleted_at') ? 'AND si.deleted_at IS NULL' : ''}
         ${itemColumns.has('is_published') ? 'AND si.is_published = 1' : ''}
         ${itemColumns.has('status') ? "AND si.status = 'published'" : ''}
       ORDER BY si.section_id ASC, ${itemColumns.has('sort_order') ? 'si.sort_order ASC,' : ''} si.id ASC`
    );

    return groupRowsBySection(Array.isArray(rows) ? rows : []);
  }

  static async getSectionMedia(sectionId) {
    const [sectionMediaColumns, mediaColumns] = await Promise.all([
      SchemaInspector.getColumns('section_media'),
      SchemaInspector.getColumns('media_library')
    ]);

    return this.query(
      `SELECT ${[
        'sm.id',
        sectionMediaColumns.has('media_role') ? 'sm.media_role' : "'gallery' AS media_role",
        sectionMediaColumns.has('caption') ? 'sm.caption' : 'NULL AS caption',
        sectionMediaColumns.has('alt_text') ? 'sm.alt_text' : 'NULL AS alt_text',
        sectionMediaColumns.has('sort_order') ? 'sm.sort_order' : '0 AS sort_order',
        mediaColumns.has('file_path') ? 'media.file_path' : 'NULL AS file_path',
        mediaColumns.has('alt_text') ? 'media.alt_text AS media_alt' : 'NULL AS media_alt',
        mediaColumns.has('title') ? 'media.title' : 'NULL AS title'
      ].join(', ')}
       FROM section_media sm
       LEFT JOIN media_library media ON media.id = sm.media_id ${mediaColumns.has('deleted_at') ? 'AND media.deleted_at IS NULL' : ''}
       WHERE sm.section_id = :sectionId
         ${sectionMediaColumns.has('deleted_at') ? 'AND sm.deleted_at IS NULL' : ''}
       ORDER BY ${sectionMediaColumns.has('sort_order') ? 'sm.sort_order ASC,' : ''} sm.id ASC`,
      { sectionId }
    );
  }

  static async getSectionMediaBySectionIds(sectionIds) {
    if (!Array.isArray(sectionIds) || !sectionIds.length) {
      return {};
    }

    const [sectionMediaColumns, mediaColumns] = await Promise.all([
      SchemaInspector.getColumns('section_media'),
      SchemaInspector.getColumns('media_library')
    ]);
    const sectionIdList = sectionIds.join(', ');

    const rows = await this.query(
      `SELECT ${[
        'sm.section_id',
        'sm.id',
        sectionMediaColumns.has('media_role') ? 'sm.media_role' : "'gallery' AS media_role",
        sectionMediaColumns.has('caption') ? 'sm.caption' : 'NULL AS caption',
        sectionMediaColumns.has('alt_text') ? 'sm.alt_text' : 'NULL AS alt_text',
        sectionMediaColumns.has('sort_order') ? 'sm.sort_order' : '0 AS sort_order',
        mediaColumns.has('file_path') ? 'media.file_path' : 'NULL AS file_path',
        mediaColumns.has('alt_text') ? 'media.alt_text AS media_alt' : 'NULL AS media_alt',
        mediaColumns.has('title') ? 'media.title' : 'NULL AS title'
      ].join(', ')}
       FROM section_media sm
       LEFT JOIN media_library media ON media.id = sm.media_id ${mediaColumns.has('deleted_at') ? 'AND media.deleted_at IS NULL' : ''}
       WHERE sm.section_id IN (${sectionIdList})
         ${sectionMediaColumns.has('deleted_at') ? 'AND sm.deleted_at IS NULL' : ''}
       ORDER BY sm.section_id ASC, ${sectionMediaColumns.has('sort_order') ? 'sm.sort_order ASC,' : ''} sm.id ASC`
    );

    return groupRowsBySection(Array.isArray(rows) ? rows : []);
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
    const columns = await SchemaInspector.getColumns('site_settings');
    return this.query(
      `SELECT setting_key, setting_value
       FROM site_settings
       WHERE setting_group = :settingGroup
         ${columns.has('deleted_at') ? 'AND deleted_at IS NULL' : ''}
         ${columns.has('status') ? "AND status = 'active'" : ''}`,
      { settingGroup }
    );
  }

  static async getSeoByRoute(routePath) {
    const [seoColumns, mediaColumns] = await Promise.all([
      SchemaInspector.getColumns('seo_meta'),
      SchemaInspector.getColumns('media_library')
    ]);

    const rows = await this.query(
      `SELECT ${[
        seoColumns.has('meta_title') ? 'meta_title' : "'' AS meta_title",
        seoColumns.has('meta_description') ? 'meta_description' : 'NULL AS meta_description',
        seoColumns.has('meta_keywords') ? 'meta_keywords' : 'NULL AS meta_keywords',
        seoColumns.has('og_title') ? 'og_title' : 'NULL AS og_title',
        seoColumns.has('og_description') ? 'og_description' : 'NULL AS og_description',
        seoColumns.has('canonical_url') ? 'canonical_url' : 'NULL AS canonical_url',
        mediaColumns.has('file_path') ? 'media.file_path AS og_image_path' : 'NULL AS og_image_path'
      ].join(', ')}
       FROM seo_meta s
       LEFT JOIN media_library media ON media.id = s.og_image_id ${mediaColumns.has('deleted_at') ? 'AND media.deleted_at IS NULL' : ''}
       WHERE s.route_path = :routePath
         ${seoColumns.has('deleted_at') ? 'AND s.deleted_at IS NULL' : ''}
       LIMIT 1`,
      { routePath }
    );

    return rows[0] || null;
  }
}

module.exports = PublicSite;
