const BaseModel = require('./BaseModel');

class Media extends BaseModel {
  static all() {
    return this.query(
      `SELECT id, title, file_name, file_path, mime_type, alt_text, file_size, created_at
       FROM media_library
       WHERE deleted_at IS NULL AND status = 'active'
       ORDER BY created_at DESC, id DESC`
    );
  }

  static create(payload) {
    return this.query(
      `INSERT INTO media_library (title, file_name, file_path, mime_type, alt_text, file_size, uploaded_by, status)
       VALUES (:title, :file_name, :file_path, :mime_type, :alt_text, :file_size, :uploaded_by, 'active')`,
      payload
    );
  }

  static async find(id) {
    const rows = await this.query(
      `SELECT id, title, file_name, file_path, mime_type, alt_text, file_size
       FROM media_library
       WHERE id = :id AND deleted_at IS NULL
       LIMIT 1`,
      { id }
    );

    return rows[0] || null;
  }
}

module.exports = Media;
