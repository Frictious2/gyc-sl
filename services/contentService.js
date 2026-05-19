const PublicSite = require('../models/PublicSite');
const seedData = require('../scripts/seed-data');

function cmsDebug(event, details = {}) {
  if (String(process.env.DEBUG_CMS || '').toLowerCase() !== 'true') {
    return;
  }

  console.log(
    `[cms-debug] ${event} ${JSON.stringify(details)}`
  );
}

function splitSemi(text = '') {
  return text
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

function safeParseArray(value, contextLabel) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`[contentService] Invalid JSON for ${contextLabel}. Falling back to an empty array.`);
    return [];
  }
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
  const sectionIds = sections.map((section) => section.id).filter(Boolean);
  const [itemsBySection, mediaBySection] = await Promise.all([
    PublicSite.getSectionItemsBySectionIds(sectionIds),
    PublicSite.getSectionMediaBySectionIds(sectionIds)
  ]);
  const enrichedSections = sections.map((section) =>
    parseSection({
      ...section,
      items: itemsBySection[section.id] || [],
      media: mediaBySection[section.id] || []
    })
  );

  return {
    ...page,
    sections: enrichedSections
  };
}

async function getDbHomePage() {
  const page = await PublicSite.getHomePage();
  if (!page) {
    cmsDebug('home.db.miss', { source: 'db', cacheUsed: false });
    return null;
  }

  let sections = [];
  try {
    sections = await PublicSite.getSectionsByPageId(page.id);
  } catch (error) {
    cmsDebug('home.sections.error', {
      source: 'db',
      cacheUsed: false,
      pageId: page.id,
      slug: page.slug || null,
      routePath: page.route_path || null,
      message: error.message
    });
    sections = [];
  }

  if (!Array.isArray(sections) || !sections.length) {
    cmsDebug('home.db.page-only', {
      source: 'db',
      cacheUsed: false,
      pageId: page.id,
      slug: page.slug || null,
      routePath: page.route_path || null,
      sections: 0
    });
    return {
      ...page,
      sections: []
    };
  }

  const sectionIds = sections.map((section) => section.id).filter(Boolean);
  let itemsBySection = {};
  let mediaBySection = {};

  try {
    [itemsBySection, mediaBySection] = await Promise.all([
      PublicSite.getSectionItemsBySectionIds(sectionIds),
      PublicSite.getSectionMediaBySectionIds(sectionIds)
    ]);
  } catch (error) {
    cmsDebug('home.section-data.error', {
      source: 'db',
      cacheUsed: false,
      pageId: page.id,
      slug: page.slug || null,
      routePath: page.route_path || null,
      sections: sectionIds.length,
      message: error.message
    });
  }
  const enrichedSections = sections.map((section) =>
    parseSection({
      ...section,
      items: itemsBySection[section.id] || [],
      media: mediaBySection[section.id] || []
    })
  );

  const result = {
    ...page,
    sections: enrichedSections
  };

  cmsDebug('home.db.hit', {
    source: 'db',
    cacheUsed: false,
    pageId: result.id,
    slug: result.slug || null,
    routePath: result.route_path || null,
    sections: enrichedSections.length,
    sectionItems: enrichedSections.reduce((sum, section) => sum + (Array.isArray(section.items) ? section.items.length : 0), 0)
  });

  return result;
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

exports.getHomePage = async () => {
  try {
    const dbPage = await getDbHomePage();
    if (dbPage) {
      cmsDebug('home.resolve', {
        source: 'db',
        cacheUsed: false,
        pageId: dbPage.id,
        slug: dbPage.slug || null,
        routePath: dbPage.route_path || null,
        sections: Array.isArray(dbPage.sections) ? dbPage.sections.length : 0
      });
      return dbPage;
    }
  } catch (error) {
    cmsDebug('home.resolve.error', {
      source: 'db',
      cacheUsed: false,
      message: error.message
    });
  }

  const fallback = normalizeSeedPage('/');
  cmsDebug('home.resolve', {
    source: 'fallback',
    cacheUsed: false,
    pageId: fallback?.id || null,
    slug: fallback?.slug || 'home',
    routePath: fallback?.route_path || '/',
    sections: Array.isArray(fallback?.sections) ? fallback.sections.length : 0
  });
  return fallback;
};

exports.getHomeContent = async () => {
  const [page, programs, partners, projects, news] = await Promise.all([
    exports.getHomePage(),
    exports.getPrograms(),
    exports.getPartners(),
    exports.getProjects(),
    exports.getNews()
  ]);

  const statsSection = page?.sections?.find((section) => section.section_key === 'impact-statistics');
  const aboutSection = page?.sections?.find((section) => section.section_key === 'about-preview');
  const heroSection = page?.sections?.find((section) => section.section_key === 'hero');
  const programsSection = page?.sections?.find((section) => section.section_key === 'programs-overview');
  const finalCta = page?.sections?.find((section) => section.section_key === 'final-cta');
  const featuredSection = page?.sections?.find((section) => section.section_key === 'featured-news-project');
  const partnersSection = page?.sections?.find((section) => section.section_key === 'partners-supporters');
  const heroContent = {
    eyebrow: heroSection?.subtitle || 'SDG-Inspired Youth Leadership',
    title: page?.hero_title || heroSection?.title || page?.title || 'Home',
    summary: page?.hero_subtitle || heroSection?.body || '',
    image: page?.hero_image_path || heroSection?.image_path || null,
    imageAlt: page?.hero_image_alt || heroSection?.image_alt || null,
    primaryButtonLabel: heroSection?.cta_label || 'Join the Movement',
    primaryButtonLink: heroSection?.cta_link || '/get-involved',
    secondaryButtonLabel: heroSection?.secondary_cta_label || 'Learn More',
    secondaryButtonLink: heroSection?.secondary_cta_link || '/about'
  };

  return {
    page,
    heroContent,
    heroSection,
    stats: statsSection ? safeParseArray(statsSection.body, 'home impact statistics') : [],
    statsSection,
    aboutSection,
    programsSection,
    featuredSection,
    partnersSection,
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
