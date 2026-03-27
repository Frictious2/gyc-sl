const BaseModel = require('./BaseModel');

const TABLES = {
  contact: 'contact_messages',
  volunteer: 'volunteer_applications',
  partnership: 'partnership_inquiries',
  newsletter: 'newsletter_subscribers'
};

class Submission extends BaseModel {
  static table(type) {
    return TABLES[type];
  }

  static list(type) {
    return this.query(
      `SELECT *
       FROM ${this.table(type)}
       WHERE deleted_at IS NULL
       ORDER BY id DESC`
    );
  }

  static create(type, payload) {
    const mappings = {
      contact: {
        sql: `INSERT INTO contact_messages (full_name, email, phone, subject, message, status)
              VALUES (:full_name, :email, :phone, :subject, :message, 'new')`
      },
      volunteer: {
        sql: `INSERT INTO volunteer_applications (full_name, email, phone, district, interests, motivation, status)
              VALUES (:full_name, :email, :phone, :district, :interests, :motivation, 'new')`
      },
      partnership: {
        sql: `INSERT INTO partnership_inquiries (organisation_name, contact_name, email, phone, partnership_type, message, status)
              VALUES (:organisation_name, :contact_name, :email, :phone, :partnership_type, :message, 'new')`
      },
      newsletter: {
        sql: `INSERT INTO newsletter_subscribers (email, status, source)
              VALUES (:email, 'active', :source)
              ON DUPLICATE KEY UPDATE status = 'active', source = VALUES(source)`
      }
    };

    return this.query(mappings[type].sql, payload);
  }

  static delete(type, id) {
    return this.query(
      `UPDATE ${this.table(type)}
       SET deleted_at = NOW()
       WHERE id = :id`,
      { id }
    );
  }
}

module.exports = Submission;
