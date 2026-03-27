const PublicSite = require('../models/PublicSite');
const seedData = require('../scripts/seed-data');

function splitSemi(text = '') {
  return text
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapSettings(rows) {
  const values = {};
  rows.forEach((row) => {
    values[row.setting_key] = row.setting_value;
  });
  return values;
}

function parseSection(section) {
  return {
    ...section,
    items: section.items || [],
    media: section.media || []
  };
}

function normalizeSeedPage(routePath) {
  const page = seedData.pages.find((entry) => entry.route_path === routePath);
  if (!page) {
    return null;
  }

  return {
    ...page,
    hero_image_path: null,
    sections: (page.sections || []).map((section) =>
      parseSection({
        ...section,
        image_path: null,
        items: [],
        media: []
      })
    )
  };
}

async function getDbPage(routePath) {
  const page = await PublicSite.getPageByRoute(routePath);
  if (!page) {
    return null;
  }

  const sections = await PublicSite.getSectionsByPageId(page.id);
  const enrichedSections = await Promise.all(
    sections.map(async (section) => {
      const [items, media] = await Promise.all([
        PublicSite.getSectionItems(section.id),
        PublicSite.getSectionMedia(section.id)
      ]);
      return parseSection({
        ...section,
        items,
        media
      });
    })
  );

  return {
    ...page,
    sections: enrichedSections
  };
}

async function withFallback(dbWork, fallback) {
  try {
    const result = await dbWork();

    if (result === null || result === undefined) {
      return fallback();
    }

    if (Array.isArray(result) && result.length === 0) {
      return fallback();
    }

    return result;
  } catch (error) {
    return fallback();
  }
}

exports.getPage = (routePath) =>
  withFallback(
    () => getDbPage(routePath),
    () => normalizeSeedPage(routePath)
  );

exports.getPrograms = () =>
  withFallback(
    async () => PublicSite.getPrograms(),
    async () => seedData.programs
  );

exports.getProgramBySlug = (slug) =>
  withFallback(
    async () => PublicSite.getProgramBySlug(slug),
    async () => seedData.programs.find((program) => program.slug === slug) || null
  );

exports.getProjects = () =>
  withFallback(
    async () => PublicSite.getProjects(),
    async () => seedData.projects
  );

exports.getProjectBySlug = (slug) =>
  withFallback(
    async () => PublicSite.getProjectBySlug(slug),
    async () => seedData.projects.find((project) => project.slug === slug) || null
  );

exports.getNews = () =>
  withFallback(
    async () => PublicSite.getNews(),
    async () => seedData.news
  );

exports.getNewsBySlug = (slug) =>
  withFallback(
    async () => PublicSite.getNewsBySlug(slug),
    async () => seedData.news.find((post) => post.slug === slug) || null
  );

exports.getResources = () =>
  withFallback(
    async () => PublicSite.getResources(),
    async () => seedData.resources
  );

exports.getGallery = () =>
  withFallback(
    async () => PublicSite.getGallery(),
    async () =>
      seedData.gallery || [
        { title: 'Community Climate Activity', category: 'Climate Action', caption: 'Placeholder gallery item ready for media uploads.' },
        { title: 'Youth Leadership Workshop', category: 'Training & Workshops', caption: 'Placeholder gallery item ready for media uploads.' },
        { title: 'Partner Engagement Event', category: 'Team & Partners', caption: 'Placeholder gallery item ready for media uploads.' }
      ]
  );

exports.getPartners = () =>
  withFallback(
    async () => PublicSite.getPartners(),
    async () => seedData.partners
  );

exports.getTeamBundle = () =>
  withFallback(
    async () => ({
      team: await PublicSite.getTeam(),
      board: await PublicSite.getBoard(),
      districts: await PublicSite.getDistrictCoordinators()
    }),
    async () => ({
      team: seedData.team,
      board: seedData.board,
      districts: seedData.districts
    })
  );

exports.getContactSettings = () =>
  withFallback(
    async () => ({
      ...seedData.contactSettings,
      ...mapSettings(await PublicSite.getSettingsByGroup('contact'))
    }),
    async () => seedData.contactSettings
  );

exports.getFooterSettings = () =>
  withFallback(
    async () => ({
      ...(seedData.footerSettings || {}),
      ...mapSettings(await PublicSite.getSettingsByGroup('footer'))
    }),
    async () => seedData.footerSettings || {}
  );

exports.getSeo = (routePath) =>
  withFallback(
    async () => PublicSite.getSeoByRoute(routePath),
    async () => seedData.seo[routePath] || seedData.seo.default
  );

exports.getHomeContent = async () => {
  const [page, programs, partners, projects, news] = await Promise.all([
    exports.getPage('/'),
    exports.getPrograms(),
    exports.getPartners(),
    exports.getProjects(),
    exports.getNews()
  ]);

  const statsSection = page?.sections?.find((section) => section.section_key === 'impact-statistics');
  const aboutSection = page?.sections?.find((section) => section.section_key === 'about-preview');
  const finalCta = page?.sections?.find((section) => section.section_key === 'final-cta');
  const featuredSection = page?.sections?.find((section) => section.section_key === 'featured-news-project');

  return {
    page,
    stats: statsSection ? JSON.parse(statsSection.body || '[]') : [],
    aboutSection,
    featuredSection,
    finalCta,
    programs: programs.slice(0, 5),
    partners: partners.slice(0, 10),
    featuredProject: projects[0] || null,
    featuredNews: news[0] || null
  };
};

exports.getProgramPageContent = async (slug) => {
  const [program, projects] = await Promise.all([
    exports.getProgramBySlug(slug),
    exports.getProjects()
  ]);

  if (!program) {
    return null;
  }

  const relatedProject =
    projects.find((project) => (project.theme || '').toLowerCase().includes((program.title || '').split(' ')[0].toLowerCase())) ||
    projects[0] ||
    null;

  return {
    program,
    challengeItems: splitSemi(program.challenge_text),
    approachItems: splitSemi(program.approach_text),
    keyActivities: splitSemi(program.key_activities),
    impactHighlights: splitSemi(program.impact_highlights),
    relatedProject
  };
};
