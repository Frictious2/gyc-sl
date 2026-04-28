const BaseModel = require('./BaseModel');
const SchemaInspector = require('./SchemaInspector');

const REQUIRED_SCHEMA = [
  {
    table: 'pages',
    columns: ['id', 'title', 'slug', 'route_path', 'page_type', 'hero_title', 'hero_subtitle', 'hero_image_id', 'status', 'is_published', 'sort_order', 'created_at', 'updated_at', 'deleted_at']
  },
  {
    table: 'page_sections',
    columns: ['id', 'page_id', 'section_key', 'title', 'subtitle', 'body', 'image_id', 'cta_label', 'cta_link', 'secondary_cta_label', 'secondary_cta_link', 'layout_style', 'status', 'is_published', 'sort_order', 'created_at', 'updated_at', 'deleted_at']
  },
  {
    table: 'section_items',
    columns: ['id', 'section_id', 'item_type', 'title', 'subtitle', 'body', 'meta_json', 'image_id', 'link_label', 'link_url', 'status', 'is_published', 'sort_order', 'created_at', 'updated_at', 'deleted_at']
  },
  {
    table: 'section_media',
    columns: ['id', 'section_id', 'media_id', 'media_role', 'caption', 'alt_text', 'sort_order', 'created_at', 'updated_at', 'deleted_at']
  },
  {
    table: 'media_library',
    columns: ['id', 'title', 'file_name', 'file_path', 'mime_type', 'alt_text', 'file_size', 'status', 'created_at', 'updated_at', 'deleted_at']
  },
  {
    table: 'seo_meta',
    columns: ['id', 'entity_type', 'entity_id', 'route_path', 'meta_title', 'meta_description', 'meta_keywords', 'og_title', 'og_description', 'og_image_id', 'canonical_url', 'created_at', 'updated_at', 'deleted_at']
  },
  {
    table: 'site_settings',
    columns: ['id', 'setting_key', 'setting_value', 'setting_group', 'status', 'created_at', 'updated_at', 'deleted_at']
  }
];

class SchemaHealth extends BaseModel {
  static async getReport() {
    try {
      await SchemaInspector.clearCache();
      const tableReports = [];

      for (const requirement of REQUIRED_SCHEMA) {
        const exists = await SchemaInspector.hasTable(requirement.table);
        const columns = exists ? await SchemaInspector.getColumns(requirement.table) : new Set();
        const missingColumns = exists
          ? requirement.columns.filter((column) => !columns.has(column))
          : requirement.columns;

        tableReports.push({
          table: requirement.table,
          exists,
          missingColumns,
          healthy: exists && missingColumns.length === 0
        });
      }

      const integrityChecks = await this.getIntegrityChecks();
      const failingTables = tableReports.filter((report) => !report.healthy).length;
      const healthy = failingTables === 0 && integrityChecks.every((check) => check.status !== 'error');

      return {
        healthy,
        connectionOk: true,
        checkedAt: new Date(),
        databaseName: process.env.DB_NAME || 'gycsl_db',
        tableReports,
        integrityChecks,
        summary: {
          totalTables: tableReports.length,
          healthyTables: tableReports.filter((report) => report.healthy).length,
          failingTables
        }
      };
    } catch (error) {
      return {
        healthy: false,
        connectionOk: false,
        checkedAt: new Date(),
        databaseName: process.env.DB_NAME || 'gycsl_db',
        error: {
          message: error.message,
          code: error.code || null
        },
        tableReports: [],
        integrityChecks: [],
        summary: {
          totalTables: REQUIRED_SCHEMA.length,
          healthyTables: 0,
          failingTables: REQUIRED_SCHEMA.length
        }
      };
    }
  }

  static async getIntegrityChecks() {
    const checks = [];

    const hasPages = await SchemaInspector.hasTable('pages');
    const hasSections = await SchemaInspector.hasTable('page_sections');
    const hasSectionMedia = await SchemaInspector.hasTable('section_media');
    const hasMediaLibrary = await SchemaInspector.hasTable('media_library');

    if (hasPages) {
      const pageColumns = await SchemaInspector.getColumns('pages');
      const routeColumn = pageColumns.has('route_path');
      const slugColumn = pageColumns.has('slug');

      let homeExists = false;
      if (routeColumn || slugColumn) {
        const whereClauses = [];
        if (routeColumn) whereClauses.push("route_path = '/'");
        if (slugColumn) whereClauses.push("slug = 'home'");
        const rows = await this.query(
          `SELECT COUNT(*) AS total
           FROM pages
           WHERE ${whereClauses.join(' OR ')}`,
          {}
        );
        homeExists = Number(rows[0]?.total || 0) > 0;
      }

      checks.push({
        key: 'home-page',
        label: 'Home page record exists',
        status: homeExists ? 'ok' : 'warn',
        detail: homeExists
          ? 'A Home page record was found by route_path or slug.'
          : 'No Home page record was found using route_path "/" or slug "home".'
      });
    }

    if (hasSections) {
      const sectionColumns = await SchemaInspector.getColumns('page_sections');
      const duplicateKeyRows = sectionColumns.has('section_key')
        ? await this.query(
            `SELECT page_id, section_key, COUNT(*) AS total
             FROM page_sections
             ${sectionColumns.has('deleted_at') ? 'WHERE deleted_at IS NULL' : ''}
             GROUP BY page_id, section_key
             HAVING COUNT(*) > 1`
          )
        : [];

      checks.push({
        key: 'duplicate-section-keys',
        label: 'Duplicate homepage/page section keys',
        status: duplicateKeyRows.length ? 'warn' : 'ok',
        detail: duplicateKeyRows.length
          ? `${duplicateKeyRows.length} duplicate page/section_key combinations were found.`
          : 'No duplicate page/section_key combinations were found.'
      });
    }

    if (hasSectionMedia && hasMediaLibrary) {
      const sectionMediaColumns = await SchemaInspector.getColumns('section_media');
      const mediaColumns = await SchemaInspector.getColumns('media_library');
      const orphanRows = await this.query(
        `SELECT COUNT(*) AS total
         FROM section_media sm
         LEFT JOIN media_library ml
           ON ml.id = sm.media_id
           ${mediaColumns.has('deleted_at') ? 'AND ml.deleted_at IS NULL' : ''}
         ${sectionMediaColumns.has('deleted_at') ? 'WHERE sm.deleted_at IS NULL' : ''}
           ${sectionMediaColumns.has('deleted_at') ? 'AND' : 'WHERE'} ml.id IS NULL`
      );

      const orphanCount = Number(orphanRows[0]?.total || 0);
      checks.push({
        key: 'orphan-section-media',
        label: 'Orphaned section media links',
        status: orphanCount ? 'warn' : 'ok',
        detail: orphanCount
          ? `${orphanCount} section_media records point to missing or deleted media.`
          : 'No orphaned section_media records were found.'
      });
    }

    return checks;
  }
}

module.exports = SchemaHealth;
