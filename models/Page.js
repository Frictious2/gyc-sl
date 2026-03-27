const BaseModel = require('./BaseModel');

class Page extends BaseModel {
  static async all() {
    return this.query(
      `SELECT id, title, route_path, page_type, hero_title, hero_subtitle, status, is_published, sort_order
       FROM pages
       WHERE deleted_at IS NULL
       ORDER BY sort_order ASC, title ASC`
    );
  }

  static async findWithSections(id) {
    const pages = await this.query(
      `SELECT id, title, slug, route_path, page_type, hero_title, hero_subtitle, hero_image_id, status, is_published
       FROM pages
       WHERE id = :id AND deleted_at IS NULL
       LIMIT 1`,
      { id }
    );

    if (!pages[0]) {
      return null;
    }

    const sections = await this.query(
      `SELECT id, section_key, title, subtitle, body, image_id, cta_label, cta_link,
              secondary_cta_label, secondary_cta_link, layout_style, status, is_published, sort_order
       FROM page_sections
       WHERE page_id = :id AND deleted_at IS NULL
       ORDER BY sort_order ASC, id ASC`,
      { id }
    );

    return {
      ...pages[0],
      sections
    };
  }

  static async updatePage(id, payload) {
    return this.query(
      `UPDATE pages
       SET title = :title,
           hero_title = :hero_title,
           hero_subtitle = :hero_subtitle,
           hero_image_id = :hero_image_id,
           status = :status,
           is_published = :is_published
       WHERE id = :id`,
      {
        id,
        ...payload
      }
    );
  }

  static async updateSection(id, payload) {
    return this.query(
      `UPDATE page_sections
       SET title = :title,
           subtitle = :subtitle,
           body = :body,
           image_id = :image_id,
           cta_label = :cta_label,
           cta_link = :cta_link,
           secondary_cta_label = :secondary_cta_label,
           secondary_cta_link = :secondary_cta_link,
           sort_order = :sort_order,
           status = :status,
           is_published = :is_published
       WHERE id = :id`,
      {
        id,
        ...payload
      }
    );
  }
}

module.exports = Page;
