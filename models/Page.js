const BaseModel = require('./BaseModel');
const SchemaInspector = require('./SchemaInspector');

function sanitizeInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function sanitizeNullableForeignKey(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function sanitizeString(value, fallback = null) {
  if (value === undefined || value === null) {
    return fallback;
  }

  const normalized = String(value).trim();
  return normalized === '' ? fallback : normalized;
}

function groupRowsBySection(rows) {
  return rows.reduce((acc, row) => {
    const key = row.section_id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {});
}

class Page extends BaseModel {
  static async all() {
    const columns = await SchemaInspector.getColumns('pages');
    const whereParts = [];
    if (columns.has('deleted_at')) {
      whereParts.push('deleted_at IS NULL');
    }

    return this.query(
      `SELECT id, title, route_path, page_type, hero_title, hero_subtitle, status, is_published, sort_order
       FROM pages
       ${whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : ''}
       ORDER BY sort_order ASC, title ASC`
    );
  }

  static async findWithSections(id) {
    const [pageColumns, sectionColumns, itemColumns, sectionMediaColumns, mediaColumns] = await Promise.all([
      SchemaInspector.getColumns('pages'),
      SchemaInspector.getColumns('page_sections'),
      SchemaInspector.getColumns('section_items'),
      SchemaInspector.getColumns('section_media'),
      SchemaInspector.getColumns('media_library')
    ]);
    const editorWarnings = [];

    const pages = await this.query(
      `SELECT ${[
        'id',
        'title',
        pageColumns.has('slug') ? 'slug' : "'' AS slug",
        pageColumns.has('route_path') ? 'route_path' : "'' AS route_path",
        pageColumns.has('page_type') ? 'page_type' : "'standard' AS page_type",
        pageColumns.has('hero_title') ? 'hero_title' : 'NULL AS hero_title',
        pageColumns.has('hero_subtitle') ? 'hero_subtitle' : 'NULL AS hero_subtitle',
        pageColumns.has('hero_image_id') ? 'hero_image_id' : 'NULL AS hero_image_id',
        pageColumns.has('status') ? 'status' : "'published' AS status",
        pageColumns.has('is_published') ? 'is_published' : '1 AS is_published'
      ].join(', ')}
       FROM pages
       WHERE id = :id
         ${pageColumns.has('deleted_at') ? 'AND deleted_at IS NULL' : ''}
       LIMIT 1`,
      { id }
    );

    if (!pages[0]) {
      return null;
    }

    let sections = [];
    try {
      sections = await this.query(
        `SELECT ${[
          'id',
          sectionColumns.has('section_key') ? 'section_key' : "CONCAT('section-', id) AS section_key",
          sectionColumns.has('title') ? 'title' : 'NULL AS title',
          sectionColumns.has('subtitle') ? 'subtitle' : 'NULL AS subtitle',
          sectionColumns.has('body') ? 'body' : 'NULL AS body',
          sectionColumns.has('image_id') ? 'image_id' : 'NULL AS image_id',
          sectionColumns.has('cta_label') ? 'cta_label' : 'NULL AS cta_label',
          sectionColumns.has('cta_link') ? 'cta_link' : 'NULL AS cta_link',
          sectionColumns.has('secondary_cta_label') ? 'secondary_cta_label' : 'NULL AS secondary_cta_label',
          sectionColumns.has('secondary_cta_link') ? 'secondary_cta_link' : 'NULL AS secondary_cta_link',
          sectionColumns.has('layout_style') ? 'layout_style' : 'NULL AS layout_style',
          sectionColumns.has('status') ? 'status' : "'published' AS status",
          sectionColumns.has('is_published') ? 'is_published' : '1 AS is_published',
          sectionColumns.has('sort_order') ? 'sort_order' : '0 AS sort_order'
        ].join(', ')}
         FROM page_sections
         WHERE page_id = :id
           ${sectionColumns.has('deleted_at') ? 'AND deleted_at IS NULL' : ''}
         ORDER BY ${sectionColumns.has('sort_order') ? 'sort_order ASC,' : ''} id ASC`,
        { id }
      );
    } catch (error) {
      editorWarnings.push(`Sections could not be loaded for this page: ${error.sqlMessage || error.message}`);
      sections = [];
    }

    const sectionIds = sections
      .map((section) => sanitizeInteger(section.id, 0))
      .filter((idValue) => idValue > 0);

    let itemsBySection = {};
    let mediaBySection = {};

    if (sectionIds.length) {
      const sectionIdList = sectionIds.join(', ');

      try {
        const items = await this.query(
          `SELECT ${[
            'section_id',
            'id',
            itemColumns.has('item_type') ? 'item_type' : "'card' AS item_type",
            itemColumns.has('title') ? 'title' : 'NULL AS title',
            itemColumns.has('subtitle') ? 'subtitle' : 'NULL AS subtitle',
            itemColumns.has('body') ? 'body' : 'NULL AS body',
            itemColumns.has('meta_json') ? 'meta_json' : 'NULL AS meta_json',
            itemColumns.has('image_id') ? 'image_id' : 'NULL AS image_id',
            itemColumns.has('link_label') ? 'link_label' : 'NULL AS link_label',
            itemColumns.has('link_url') ? 'link_url' : 'NULL AS link_url',
            itemColumns.has('status') ? 'status' : "'published' AS status",
            itemColumns.has('is_published') ? 'is_published' : '1 AS is_published',
            itemColumns.has('sort_order') ? 'sort_order' : '0 AS sort_order'
          ].join(', ')}
           FROM section_items
           WHERE section_id IN (${sectionIdList})
             ${itemColumns.has('deleted_at') ? 'AND deleted_at IS NULL' : ''}
           ORDER BY section_id ASC, ${itemColumns.has('sort_order') ? 'sort_order ASC,' : ''} id ASC`
        );
        itemsBySection = groupRowsBySection(Array.isArray(items) ? items : []);
      } catch (error) {
        editorWarnings.push(`Section items could not be loaded for this page: ${error.sqlMessage || error.message}`);
      }

      try {
        const mediaRows = await this.query(
          `SELECT ${[
            'sm.section_id',
            'sm.id',
            sectionMediaColumns.has('media_id') ? 'sm.media_id' : 'NULL AS media_id',
            sectionMediaColumns.has('media_role') ? 'sm.media_role' : "'gallery' AS media_role",
            sectionMediaColumns.has('caption') ? 'sm.caption' : 'NULL AS caption',
            sectionMediaColumns.has('alt_text') ? 'sm.alt_text' : 'NULL AS alt_text',
            sectionMediaColumns.has('sort_order') ? 'sm.sort_order' : '0 AS sort_order',
            mediaColumns.has('file_path') ? 'ml.file_path' : 'NULL AS file_path',
            mediaColumns.has('title') ? 'ml.title AS media_title' : "NULL AS media_title",
            mediaColumns.has('file_name') ? 'ml.file_name AS media_file_name' : "NULL AS media_file_name"
          ].join(', ')}
           FROM section_media sm
           LEFT JOIN media_library ml ON ml.id = sm.media_id ${mediaColumns.has('deleted_at') ? 'AND ml.deleted_at IS NULL' : ''}
           WHERE sm.section_id IN (${sectionIdList})
             ${sectionMediaColumns.has('deleted_at') ? 'AND sm.deleted_at IS NULL' : ''}
           ORDER BY sm.section_id ASC, ${sectionMediaColumns.has('sort_order') ? 'sm.sort_order ASC,' : ''} sm.id ASC`
        );
        mediaBySection = groupRowsBySection(Array.isArray(mediaRows) ? mediaRows : []);
      } catch (error) {
        editorWarnings.push(`Section media could not be loaded for this page: ${error.sqlMessage || error.message}`);
      }
    }

    const enrichedSections = sections.map((section) => ({
      ...section,
      items: Array.isArray(itemsBySection[section.id]) ? itemsBySection[section.id] : [],
      media: Array.isArray(mediaBySection[section.id]) ? mediaBySection[section.id] : []
    }));

    return {
      ...pages[0],
      sections: Array.isArray(enrichedSections) ? enrichedSections : [],
      editorWarnings
    };
  }

  static async updatePage(id, payload) {
    const columns = await SchemaInspector.getColumns('pages');
    const updates = [];
    const params = { id };

    const fieldMap = {
      title: sanitizeString(payload.title, ''),
      hero_title: sanitizeString(payload.hero_title),
      hero_subtitle: payload.hero_subtitle ?? null,
      hero_image_id: sanitizeNullableForeignKey(payload.hero_image_id),
      status: sanitizeString(payload.status, 'published'),
      is_published: payload.is_published ? 1 : 0
    };

    Object.entries(fieldMap).forEach(([key, value]) => {
      if (columns.has(key)) {
        updates.push(`${key} = :${key}`);
        params[key] = value;
      }
    });

    if (!updates.length) {
      return { affectedRows: 0 };
    }

    return this.query(
      `UPDATE pages
       SET ${updates.join(', ')}
       WHERE id = :id`,
      params
    );
  }

  static async updateSection(id, payload) {
    const columns = await SchemaInspector.getColumns('page_sections');
    const updates = [];
    const params = { id };

    const fieldMap = {
      title: sanitizeString(payload.title),
      subtitle: sanitizeString(payload.subtitle),
      body: payload.body ?? null,
      image_id: sanitizeNullableForeignKey(payload.image_id),
      cta_label: sanitizeString(payload.cta_label),
      cta_link: sanitizeString(payload.cta_link),
      secondary_cta_label: sanitizeString(payload.secondary_cta_label),
      secondary_cta_link: sanitizeString(payload.secondary_cta_link),
      sort_order: sanitizeInteger(payload.sort_order, 0),
      status: sanitizeString(payload.status, 'published'),
      is_published: payload.is_published ? 1 : 0
    };

    Object.entries(fieldMap).forEach(([key, value]) => {
      if (columns.has(key)) {
        updates.push(`${key} = :${key}`);
        params[key] = value;
      }
    });

    if (!updates.length) {
      return { affectedRows: 0 };
    }

    return this.query(
      `UPDATE page_sections
       SET ${updates.join(', ')}
       WHERE id = :id`,
      params
    );
  }

  static async createSectionItem(payload) {
    const columns = await SchemaInspector.getColumns('section_items');
    const insertColumns = [];
    const insertPlaceholders = [];
    const params = {};

    const fieldMap = {
      section_id: sanitizeInteger(payload.section_id, 0),
      item_type: sanitizeString(payload.item_type, 'card'),
      title: sanitizeString(payload.title),
      subtitle: sanitizeString(payload.subtitle),
      body: payload.body ?? null,
      meta_json: sanitizeString(payload.meta_json),
      image_id: sanitizeNullableForeignKey(payload.image_id),
      link_label: sanitizeString(payload.link_label),
      link_url: sanitizeString(payload.link_url),
      status: sanitizeString(payload.status, 'published'),
      is_published: payload.is_published ? 1 : 0,
      sort_order: sanitizeInteger(payload.sort_order, 0)
    };

    Object.entries(fieldMap).forEach(([key, value]) => {
      if (columns.has(key)) {
        insertColumns.push(key);
        insertPlaceholders.push(`:${key}`);
        params[key] = value;
      }
    });

    return this.query(
      `INSERT INTO section_items (${insertColumns.join(', ')})
       VALUES (${insertPlaceholders.join(', ')})`,
      params
    );
  }

  static async updateSectionItem(id, payload) {
    const columns = await SchemaInspector.getColumns('section_items');
    const updates = [];
    const params = { id };

    const fieldMap = {
      item_type: sanitizeString(payload.item_type, 'card'),
      title: sanitizeString(payload.title),
      subtitle: sanitizeString(payload.subtitle),
      body: payload.body ?? null,
      meta_json: sanitizeString(payload.meta_json),
      image_id: sanitizeNullableForeignKey(payload.image_id),
      link_label: sanitizeString(payload.link_label),
      link_url: sanitizeString(payload.link_url),
      status: sanitizeString(payload.status, 'published'),
      is_published: payload.is_published ? 1 : 0,
      sort_order: sanitizeInteger(payload.sort_order, 0)
    };

    Object.entries(fieldMap).forEach(([key, value]) => {
      if (columns.has(key)) {
        updates.push(`${key} = :${key}`);
        params[key] = value;
      }
    });

    if (!updates.length) {
      return { affectedRows: 0 };
    }

    return this.query(
      `UPDATE section_items
       SET ${updates.join(', ')}
       WHERE id = :id`,
      params
    );
  }

  static async deleteSectionItem(id) {
    const columns = await SchemaInspector.getColumns('section_items');
    if (!columns.has('deleted_at')) {
      return this.query(
        `DELETE FROM section_items
         WHERE id = :id`,
        { id }
      );
    }

    return this.query(
      `UPDATE section_items
       SET deleted_at = NOW()
       WHERE id = :id`,
      { id }
    );
  }

  static async createSectionMedia(payload) {
    const columns = await SchemaInspector.getColumns('section_media');
    const insertColumns = [];
    const insertPlaceholders = [];
    const params = {};

    const fieldMap = {
      section_id: sanitizeInteger(payload.section_id, 0),
      media_id: sanitizeNullableForeignKey(payload.media_id),
      media_role: sanitizeString(payload.media_role, 'gallery'),
      caption: sanitizeString(payload.caption),
      alt_text: sanitizeString(payload.alt_text),
      sort_order: sanitizeInteger(payload.sort_order, 0)
    };

    Object.entries(fieldMap).forEach(([key, value]) => {
      if (columns.has(key)) {
        insertColumns.push(key);
        insertPlaceholders.push(`:${key}`);
        params[key] = value;
      }
    });

    return this.query(
      `INSERT INTO section_media (${insertColumns.join(', ')})
       VALUES (${insertPlaceholders.join(', ')})`,
      params
    );
  }

  static async deleteSectionMedia(id) {
    const columns = await SchemaInspector.getColumns('section_media');
    if (columns.has('deleted_at')) {
      return this.query(
        `UPDATE section_media
         SET deleted_at = NOW()
         WHERE id = :id`,
        { id }
      );
    }

    return this.query(
      `DELETE FROM section_media WHERE id = :id`,
      { id }
    );
  }
}

module.exports = Page;
