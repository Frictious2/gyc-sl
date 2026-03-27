const BaseModel = require('./BaseModel');

class Dashboard extends BaseModel {
  static async getSummary() {
    const [programs, projects, newsPosts, galleryItems, messages] = await Promise.all([
      this.query('SELECT COUNT(*) AS total FROM programs WHERE deleted_at IS NULL'),
      this.query('SELECT COUNT(*) AS total FROM projects WHERE deleted_at IS NULL'),
      this.query('SELECT COUNT(*) AS total FROM news_posts WHERE deleted_at IS NULL'),
      this.query('SELECT COUNT(*) AS total FROM gallery_items WHERE deleted_at IS NULL'),
      this.query('SELECT COUNT(*) AS total FROM contact_messages WHERE deleted_at IS NULL')
    ]);

    return {
      programs: programs[0]?.total || 0,
      projects: projects[0]?.total || 0,
      newsPosts: newsPosts[0]?.total || 0,
      galleryItems: galleryItems[0]?.total || 0,
      contactMessages: messages[0]?.total || 0
    };
  }
}

module.exports = Dashboard;
