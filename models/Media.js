const BaseModel = require('./BaseModel');
const SchemaInspector = require('./SchemaInspector');

class Media extends BaseModel {
  static async all() {
    const columns = await SchemaInspector.getColumns('media_library');
    const selectParts = ['id'];

    if (columns.has('title')) selectParts.push('title');
    if (columns.has('file_name')) selectParts.push('file_name');
    if (columns.has('file_path')) selectParts.push('file_path');
    if (columns.has('mime_type')) selectParts.push('mime_type');
    if (columns.has('alt_text')) selectParts.push('alt_text');
    if (columns.has('file_size')) selectParts.push('file_size');
    if (columns.has('created_at')) selectParts.push('created_at');

    const whereParts = [];
    if (columns.has('deleted_at')) {
      whereParts.push('deleted_at IS NULL');
    }
    if (columns.has('status')) {
      whereParts.push("status = 'active'");
    }

    return this.query(
      `SELECT ${selectParts.join(', ')}
       FROM media_library
       ${whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : ''}
       ORDER BY ${columns.has('created_at') ? 'created_at DESC,' : ''} id DESC`
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

  static delete(id) {
    return this.query(
      `UPDATE media_library
       SET deleted_at = NOW(), status = 'inactive'
       WHERE id = :id`,
      { id }
    );
  }
}

module.exports = Media;
