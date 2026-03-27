const db = require('../config/database');

class BaseModel {
  static async query(sql, params) {
    const [rows] = await db.query(sql, params);
    return rows;
  }
}

module.exports = BaseModel;
