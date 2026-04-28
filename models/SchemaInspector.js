const BaseModel = require('./BaseModel');

class SchemaInspector extends BaseModel {
  static cache = new Map();
  static tableCache = null;

  static async getColumns(tableName) {
    if (this.cache.has(tableName)) {
      return this.cache.get(tableName);
    }

    const rows = await this.query(
      `SELECT COLUMN_NAME
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = :tableName`,
      { tableName }
    );

    const columns = new Set(rows.map((row) => row.COLUMN_NAME));
    this.cache.set(tableName, columns);
    return columns;
  }

  static async hasColumn(tableName, columnName) {
    const columns = await this.getColumns(tableName);
    return columns.has(columnName);
  }

  static async getTables() {
    if (this.tableCache) {
      return this.tableCache;
    }

    const rows = await this.query(
      `SELECT TABLE_NAME
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE()`
    );

    const tables = new Set(rows.map((row) => row.TABLE_NAME));
    this.tableCache = tables;
    return tables;
  }

  static async hasTable(tableName) {
    const tables = await this.getTables();
    return tables.has(tableName);
  }

  static async clearCache() {
    this.cache.clear();
    this.tableCache = null;
  }
}

module.exports = SchemaInspector;
