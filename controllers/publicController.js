const contentService = require('../services/contentService');

function render(res, view, payload = {}) {
  res.render(view, {
    layout: 'layouts/main',
    ...payload
  });
}

function metaFromSeo(seo, fallbackTitle) {
  return {
    title: seo?.meta_title || seo?.title || fallbackTitle,
    description: seo?.meta_description || seo?.description || '',
    keywords: seo?.meta_keywords || seo?.keywords || '',
    ogTitle: seo?.og_title || seo?.meta_title || seo?.title || fallbackTitle,
    ogDescription: seo?.og_description || seo?.meta_description || seo?.description || '',
    ogImage: seo?.og_image_path || '',
    canonicalUrl: seo?.canonical_url || ''
  };
}

exports.home = async (req, res, next) => {
  try {
    const [homeContent, seo, contactSettings, footerSettings] = await Promise.all([
      contentService.getHomeContent(),
      contentService.getSeo('/'),
      contentService.getContactSettings(),
      contentService.getFooterSettings()
    ]);

    if (String(process.env.NODE_ENV || '').toLowerCase() === 'production' && !homeContent?.page) {
      console.error('[publicController.home] Production homepage DB record could not be resolved.');
      return res.status(500).render('pages/500', {
        title: 'Homepage Unavailable',
        pageMeta: {
          title: 'Homepage Unavailable',
          description: 'The homepage content could not be loaded from the database.'
        }
      });
    }

    render(res, 'pages/index', {
      title: 'Home',
      pageMeta: metaFromSeo(seo, 'Home'),
      homeContent,
      contactSettings,
      footerSettings
    });
  } catch (error) {
    next(error);
  }
};

exports.standardPage = async (req, res, next) => {
  try {
    const [page, seo, contactSettings, footerSettings] = await Promise.all([
      contentService.getPage(req.path),
      contentService.getSeo(req.path),
      contentService.getContactSettings(),
      contentService.getFooterSettings()
    ]);

    if (!page) {
      return res.status(404).render('pages/404', { title: 'Page Not Found' });
    }

    render(res, 'pages/page', {
      title: page.title,
      pageMeta: metaFromSeo(seo, page.title),
      page,
      contactSettings,
      footerSettings
    });
  } catch (error) {
    next(error);
  }
};

exports.teamPage = async (req, res, next) => {
  try {
    const [page, teamBundle, seo, footerSettings] = await Promise.all([
      contentService.getPage('/about/team'),
      contentService.getTeamBundle(),
      contentService.getSeo('/about'),
      contentService.getFooterSettings()
    ]);

    render(res, 'pages/about/team', {
      title: page?.title || 'Our Team',
      pageMeta: metaFromSeo(seo, page?.title || 'Our Team'),
      page,
      teamBundle,
      footerSettings
    });
  } catch (error) {
    next(error);
  }
};

exports.partnersPage = async (req, res, next) => {
  try {
    const [page, partners, seo, footerSettings] = await Promise.all([
      contentService.getPage('/about/partners'),
      contentService.getPartners(),
      contentService.getSeo('/about'),
      contentService.getFooterSettings()
    ]);

    render(res, 'pages/about/partners', {
      title: page?.title || 'Partners',
      pageMeta: metaFromSeo(seo, page?.title || 'Partners'),
      page,
      partners,
      footerSettings
    });
  } catch (error) {
    next(error);
  }
};

exports.programsOverview = async (req, res, next) => {
  try {
    const [page, programs, seo, footerSettings] = await Promise.all([
      contentService.getPage('/programs'),
      contentService.getPrograms(),
      contentService.getSeo('/programs'),
      contentService.getFooterSettings()
    ]);

    render(res, 'pages/programs/index', {
      title: page?.title || 'Programs',
      pageMeta: metaFromSeo(seo, page?.title || 'Programs'),
      page,
      programs,
      footerSettings
    });
  } catch (error) {
    next(error);
  }
};

exports.programDetail = async (req, res, next) => {
  try {
    const content = await contentService.getProgramPageContent(req.params.slug);

    if (!content) {
      return res.status(404).render('pages/404', { title: 'Program Not Found' });
    }

    render(res, 'pages/programs/detail', {
      title: content.program.title,
      pageMeta: metaFromSeo(await contentService.getSeo(`/programs/${req.params.slug}`), content.program.title),
      content,
      footerSettings: await contentService.getFooterSettings()
    });
  } catch (error) {
    next(error);
  }
};

exports.projectsListing = async (req, res, next) => {
  try {
    const [page, allProjects, seo, footerSettings] = await Promise.all([
      contentService.getPage('/projects'),
      contentService.getProjects(),
      contentService.getSeo('/projects'),
      contentService.getFooterSettings()
    ]);

    const filters = {
      theme: (req.query.theme || '').trim().toLowerCase(),
      location: (req.query.location || '').trim().toLowerCase(),
      status: (req.query.status || '').trim().toLowerCase()
    };

    const projects = allProjects.filter((project) => {
      const themeMatch = !filters.theme || (project.theme || '').toLowerCase().includes(filters.theme);
      const locationMatch = !filters.location || (project.location || '').toLowerCase().includes(filters.location);
      const statusMatch = !filters.status || (project.project_status || project.status || '').toLowerCase() === filters.status;
      return themeMatch && locationMatch && statusMatch;
    });

    render(res, 'pages/projects/index', {
      title: 'Projects',
      pageMeta: metaFromSeo(seo, 'Projects'),
      page,
      projects,
      filters,
      footerSettings
    });
  } catch (error) {
    next(error);
  }
};

exports.projectDetail = async (req, res, next) => {
  try {
    const project = await contentService.getProjectBySlug(req.params.slug);

    if (!project) {
      return res.status(404).render('pages/404', { title: 'Project Not Found' });
    }

    render(res, 'pages/projects/detail', {
      title: project.title,
      pageMeta: metaFromSeo(await contentService.getSeo('/projects'), project.title),
      project,
      footerSettings: await contentService.getFooterSettings()
    });
  } catch (error) {
    next(error);
  }
};

exports.newsListing = async (req, res, next) => {
  try {
    const [page, posts, seo, footerSettings] = await Promise.all([
      contentService.getPage('/news'),
      contentService.getNews(),
      contentService.getSeo('/news'),
      contentService.getFooterSettings()
    ]);

    render(res, 'pages/news/index', {
      title: 'News',
      pageMeta: metaFromSeo(seo, 'News'),
      page,
      posts,
      footerSettings
    });
  } catch (error) {
    next(error);
  }
};

exports.newsDetail = async (req, res, next) => {
  try {
    const post = await contentService.getNewsBySlug(req.params.slug);

    if (!post) {
      return res.status(404).render('pages/404', { title: 'Post Not Found' });
    }

    render(res, 'pages/news/detail', {
      title: post.title,
      pageMeta: metaFromSeo(await contentService.getSeo('/news'), post.title),
      post,
      footerSettings: await contentService.getFooterSettings()
    });
  } catch (error) {
    next(error);
  }
};

exports.resourcesPage = async (req, res, next) => {
  try {
    const [page, resources, footerSettings] = await Promise.all([
      contentService.getPage('/resources'),
      contentService.getResources(),
      contentService.getFooterSettings()
    ]);

    const groupedResources = resources.reduce((acc, resource) => {
      const key = resource.category || 'other';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(resource);
      return acc;
    }, {});

    render(res, 'pages/resources/index', {
      title: page?.title || 'Resources',
      pageMeta: metaFromSeo(await contentService.getSeo('/resources'), page?.title || 'Resources'),
      page,
      groupedResources,
      footerSettings
    });
  } catch (error) {
    next(error);
  }
};

exports.galleryPage = async (req, res, next) => {
  try {
    const [page, allGalleryItems, footerSettings] = await Promise.all([
      contentService.getPage('/gallery'),
      contentService.getGallery(),
      contentService.getFooterSettings()
    ]);

    const activeCategory = (req.query.category || '').trim().toLowerCase();
    const galleryItems = allGalleryItems.filter((item) =>
      !activeCategory || (item.category || '').toLowerCase() === activeCategory
    );
    const categories = [...new Set(allGalleryItems.map((item) => item.category).filter(Boolean))];

    render(res, 'pages/gallery/index', {
      title: page?.title || 'Gallery',
      pageMeta: metaFromSeo(await contentService.getSeo('/gallery'), page?.title || 'Gallery'),
      page,
      galleryItems,
      categories,
      activeCategory,
      footerSettings
    });
  } catch (error) {
    next(error);
  }
};

exports.contactPage = async (req, res, next) => {
  try {
    const [page, contactSettings, footerSettings] = await Promise.all([
      contentService.getPage('/contact'),
      contentService.getContactSettings(),
      contentService.getFooterSettings()
    ]);

    render(res, 'pages/contact/index', {
      title: page?.title || 'Contact',
      pageMeta: metaFromSeo(await contentService.getSeo('/contact'), page?.title || 'Contact'),
      page,
      contactSettings,
      footerSettings
    });
  } catch (error) {
    next(error);
  }
};
