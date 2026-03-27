const BaseModel = require('./BaseModel');

class Setting extends BaseModel {
  static byGroup(settingGroup) {
    return this.query(
      `SELECT id, setting_key, setting_value
       FROM site_settings
       WHERE setting_group = :settingGroup AND deleted_at IS NULL
       ORDER BY setting_key ASC`,
      { settingGroup }
    );
  }

  static save(settingKey, settingValue, settingGroup = 'general') {
    return this.query(
      `INSERT INTO site_settings (setting_key, setting_value, setting_group, status)
       VALUES (:settingKey, :settingValue, :settingGroup, 'active')
       ON DUPLICATE KEY UPDATE
         setting_value = VALUES(setting_value),
         setting_group = VALUES(setting_group),
         status = 'active'`,
      { settingKey, settingValue, settingGroup }
    );
  }

  static async byKey(settingKey) {
    const rows = await this.query(
      `SELECT id, setting_key, setting_value, setting_group
       FROM site_settings
       WHERE setting_key = :settingKey AND deleted_at IS NULL
       LIMIT 1`,
      { settingKey }
    );

    return rows[0] || null;
  }
}

module.exports = Setting;
