const BaseModel = require('./BaseModel');

class SeoMeta extends BaseModel {
  static list() {
    return this.query(
      `SELECT id, route_path, meta_title, meta_description, meta_keywords, canonical_url
       FROM seo_meta
       WHERE deleted_at IS NULL
       ORDER BY route_path ASC, id ASC`
    );
  }

  static async find(id) {
    const rows = await this.query(
      `SELECT *
       FROM seo_meta
       WHERE id = :id AND deleted_at IS NULL
       LIMIT 1`,
      { id }
    );

    return rows[0] || null;
  }

  static update(id, payload) {
    return this.query(
      `UPDATE seo_meta
       SET route_path = :route_path,
           meta_title = :meta_title,
           meta_description = :meta_description,
           meta_keywords = :meta_keywords,
           og_title = :og_title,
           og_description = :og_description,
           og_image_id = :og_image_id,
           canonical_url = :canonical_url
       WHERE id = :id`,
      { id, ...payload }
    );
  }
}

module.exports = SeoMeta;
