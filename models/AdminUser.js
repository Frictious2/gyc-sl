const BaseModel = require('./BaseModel');

class AdminUser extends BaseModel {
  static findByEmail(email) {
    return this.query(
      'SELECT id, full_name, email, password_hash, role, status FROM admin_users WHERE email = :email AND deleted_at IS NULL LIMIT 1',
      { email }
    );
  }
}

module.exports = AdminUser;
