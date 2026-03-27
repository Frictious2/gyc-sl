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

    const enrichedSections = await Promise.all(
      sections.map(async (section) => {
        const [items, media] = await Promise.all([
          this.query(
            `SELECT id, item_type, title, subtitle, body, meta_json, image_id, link_label, link_url, status, is_published, sort_order
             FROM section_items
             WHERE section_id = :sectionId AND deleted_at IS NULL
             ORDER BY sort_order ASC, id ASC`,
            { sectionId: section.id }
          ),
          this.query(
            `SELECT sm.id, sm.media_id, sm.media_role, sm.caption, sm.alt_text, sm.sort_order,
                    ml.file_path, ml.title AS media_title
             FROM section_media sm
             INNER JOIN media_library ml ON ml.id = sm.media_id
             WHERE sm.section_id = :sectionId AND sm.deleted_at IS NULL
             ORDER BY sm.sort_order ASC, sm.id ASC`,
            { sectionId: section.id }
          )
        ]);

        return {
          ...section,
          items,
          media
        };
      })
    );

    return {
      ...pages[0],
      sections: enrichedSections
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

  static async createSectionItem(payload) {
    return this.query(
      `INSERT INTO section_items (
        section_id, item_type, title, subtitle, body, meta_json, image_id, link_label, link_url, status, is_published, sort_order
      ) VALUES (
        :section_id, :item_type, :title, :subtitle, :body, :meta_json, :image_id, :link_label, :link_url, :status, :is_published, :sort_order
      )`,
      payload
    );
  }

  static async updateSectionItem(id, payload) {
    return this.query(
      `UPDATE section_items
       SET item_type = :item_type,
           title = :title,
           subtitle = :subtitle,
           body = :body,
           meta_json = :meta_json,
           image_id = :image_id,
           link_label = :link_label,
           link_url = :link_url,
           status = :status,
           is_published = :is_published,
           sort_order = :sort_order
       WHERE id = :id`,
      { id, ...payload }
    );
  }

  static async deleteSectionItem(id) {
    return this.query(
      `UPDATE section_items
       SET deleted_at = NOW()
       WHERE id = :id`,
      { id }
    );
  }

  static async createSectionMedia(payload) {
    return this.query(
      `INSERT INTO section_media (section_id, media_id, media_role, caption, alt_text, sort_order)
       VALUES (:section_id, :media_id, :media_role, :caption, :alt_text, :sort_order)`,
      payload
    );
  }

  static async deleteSectionMedia(id) {
    return this.query(
      `DELETE FROM section_media WHERE id = :id`,
      { id }
    );
  }
}

module.exports = Page;
