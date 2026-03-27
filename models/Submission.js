const BaseModel = require('./BaseModel');

const TABLES = {
  contact: 'contact_messages',
  volunteer: 'volunteer_applications',
  partnership: 'partnership_inquiries',
  newsletter: 'newsletter_subscribers'
};

class Submission extends BaseModel {
  static contactStatusSchema = null;

  static table(type) {
    return TABLES[type];
  }

  static async getContactStatusSchema() {
    if (this.contactStatusSchema) {
      return this.contactStatusSchema;
    }

    const rows = await this.query(
      `SELECT COLUMN_TYPE
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'contact_messages'
         AND COLUMN_NAME = 'status'
       LIMIT 1`
    );

    const columnType = rows[0]?.COLUMN_TYPE || '';
    const isLegacy = columnType.includes("'reviewed'") || columnType.includes("'responded'");

    this.contactStatusSchema = isLegacy
      ? {
          queryMap: {
            new: 'new',
            read: 'reviewed',
            replied: 'responded'
          },
          labelMap: {
            new: 'new',
            reviewed: 'read',
            responded: 'replied',
            archived: 'read'
          }
        }
      : {
          queryMap: {
            new: 'new',
            read: 'read',
            replied: 'replied'
          },
          labelMap: {
            new: 'new',
            read: 'read',
            replied: 'replied'
          }
        };

    return this.contactStatusSchema;
  }

  static normalizeContactRecord(record, labelMap) {
    return {
      ...record,
      status: labelMap[record.status] || record.status
    };
  }

  static list(type, options = {}) {
    if (type === 'contact') {
      return this.getContactStatusSchema().then(({ queryMap, labelMap }) => {
        const filterValue =
          options.status && ['new', 'read', 'replied'].includes(options.status)
            ? queryMap[options.status]
            : null;

        return this.query(
          `SELECT *
           FROM contact_messages
           WHERE deleted_at IS NULL
             ${filterValue ? 'AND status = :status' : ''}
           ORDER BY created_at DESC`,
          filterValue ? { status: filterValue } : {}
        ).then((rows) =>
          rows
            .map((row) => this.normalizeContactRecord(row, labelMap))
            .sort((a, b) => {
              const order = { new: 0, read: 1, replied: 2 };
              if ((order[a.status] ?? 9) !== (order[b.status] ?? 9)) {
                return (order[a.status] ?? 9) - (order[b.status] ?? 9);
              }
              return new Date(b.created_at) - new Date(a.created_at);
            })
        );
      });
    }

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

  static findRecentDuplicateContact(payload) {
    return this.query(
      `SELECT id, created_at
       FROM contact_messages
       WHERE deleted_at IS NULL
         AND email = :email
         AND COALESCE(subject, '') = COALESCE(:subject, '')
         AND message = :message
         AND created_at >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
       ORDER BY created_at DESC
       LIMIT 1`,
      {
        email: payload.email,
        subject: payload.subject || null,
        message: payload.message
      }
    );
  }

  static updateContactStatus(id, status) {
    return this.getContactStatusSchema().then(({ queryMap }) =>
      this.query(
        `UPDATE contact_messages
         SET status = :status
         WHERE id = :id
           AND deleted_at IS NULL`,
        { id, status: queryMap[status] || status }
      )
    );
  }

  static async getContactFilters() {
    const { labelMap } = await this.getContactStatusSchema();
    const rows = await this.query(
      `SELECT status, COUNT(*) AS total
       FROM contact_messages
       WHERE deleted_at IS NULL
       GROUP BY status`
    );

    return rows.reduce(
      (acc, row) => ({
        ...acc,
        [labelMap[row.status] || row.status]: (acc[labelMap[row.status] || row.status] || 0) + Number(row.total)
      }),
      { new: 0, read: 0, replied: 0 }
    );
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
