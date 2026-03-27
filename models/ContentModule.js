const BaseModel = require('./BaseModel');

const MODULES = {
  programs: {
    table: 'programs',
    singular: 'program',
    titleField: 'title',
    fields: ['title', 'slug', 'short_description', 'challenge_text', 'approach_text', 'key_activities', 'impact_highlights', 'featured_project_id', 'hero_image_id', 'accent_color', 'status', 'is_featured', 'is_published', 'sort_order'],
    listFields: 'id, title, slug, status, is_published, sort_order'
  },
  projects: {
    table: 'projects',
    singular: 'project',
    titleField: 'title',
    fields: ['program_id', 'title', 'slug', 'summary', 'body', 'theme', 'location', 'project_status', 'featured_image_id', 'start_date', 'end_date', 'status', 'is_featured', 'is_published', 'sort_order', 'partners_text'],
    listFields: 'id, title, slug, project_status, status, is_published, sort_order'
  },
  news: {
    table: 'news_posts',
    singular: 'post',
    titleField: 'title',
    fields: ['title', 'slug', 'category', 'excerpt', 'body', 'featured_image_id', 'published_at', 'author_name', 'status', 'is_featured', 'sort_order'],
    listFields: 'id, title, slug, category, status, is_featured, sort_order'
  },
  resources: {
    table: 'resources',
    singular: 'resource',
    titleField: 'title',
    fields: ['title', 'slug', 'category', 'summary', 'file_media_id', 'external_url', 'status', 'is_featured', 'sort_order'],
    listFields: 'id, title, slug, category, status, is_featured, sort_order'
  },
  gallery: {
    table: 'gallery_items',
    singular: 'gallery item',
    titleField: 'title',
    fields: ['title', 'slug', 'category', 'caption', 'media_id', 'related_program_id', 'related_project_id', 'status', 'is_featured', 'sort_order'],
    listFields: 'id, title, slug, category, status, is_featured, sort_order'
  },
  partners: {
    table: 'partners',
    singular: 'partner',
    titleField: 'name',
    fields: ['name', 'slug', 'summary', 'website_url', 'logo_media_id', 'partner_type', 'status', 'is_featured', 'sort_order'],
    listFields: 'id, name, slug, partner_type, status, is_featured, sort_order'
  },
  team: {
    table: 'team_members',
    singular: 'team member',
    titleField: 'full_name',
    fields: ['full_name', 'slug', 'role_title', 'bio', 'photo_media_id', 'email', 'linkedin_url', 'status', 'sort_order'],
    listFields: 'id, full_name, slug, role_title, status, sort_order'
  },
  board: {
    table: 'board_members',
    singular: 'board member',
    titleField: 'full_name',
    fields: ['full_name', 'slug', 'role_title', 'bio', 'photo_media_id', 'status', 'sort_order'],
    listFields: 'id, full_name, slug, role_title, status, sort_order'
  },
  districts: {
    table: 'district_coordinators',
    singular: 'district coordinator',
    titleField: 'full_name',
    fields: ['full_name', 'slug', 'district_name', 'phone', 'email', 'bio', 'photo_media_id', 'status', 'sort_order'],
    listFields: 'id, full_name, slug, district_name, status, sort_order'
  }
};

class ContentModule extends BaseModel {
  static getConfig(moduleKey) {
    return MODULES[moduleKey] || null;
  }

  static async list(moduleKey) {
    const config = this.getConfig(moduleKey);
    return this.query(
      `SELECT ${config.listFields}
       FROM ${config.table}
       WHERE deleted_at IS NULL
       ORDER BY sort_order ASC, id ASC`
    );
  }

  static async find(moduleKey, id) {
    const config = this.getConfig(moduleKey);
    const rows = await this.query(
      `SELECT *
       FROM ${config.table}
       WHERE id = :id AND deleted_at IS NULL
       LIMIT 1`,
      { id }
    );

    return rows[0] || null;
  }

  static async create(moduleKey, payload) {
    const config = this.getConfig(moduleKey);
    const fields = config.fields;
    const columns = fields.join(', ');
    const params = fields.map((field) => `:${field}`).join(', ');
    await this.query(
      `INSERT INTO ${config.table} (${columns})
       VALUES (${params})`,
      payload
    );
  }

  static async update(moduleKey, id, payload) {
    const config = this.getConfig(moduleKey);
    const setters = config.fields.map((field) => `${field} = :${field}`).join(', ');
    await this.query(
      `UPDATE ${config.table}
       SET ${setters}
       WHERE id = :id`,
      { id, ...payload }
    );
  }

  static async softDelete(moduleKey, id) {
    const config = this.getConfig(moduleKey);
    await this.query(
      `UPDATE ${config.table}
       SET deleted_at = NOW()
       WHERE id = :id`,
      { id }
    );
  }
}

module.exports = ContentModule;
