const modules = [
  { slug: 'pages', label: 'Pages & Sections' },
  { slug: 'programs', label: 'Programs' },
  { slug: 'projects', label: 'Projects' },
  { slug: 'news', label: 'News & Events' },
  { slug: 'resources', label: 'Resources' },
  { slug: 'gallery', label: 'Gallery' },
  { slug: 'partners', label: 'Partners' },
  { slug: 'team', label: 'Team Members' },
  { slug: 'board', label: 'Board Members' },
  { slug: 'districts', label: 'District Coordinators' },
  { slug: 'footer', label: 'Contact & Footer Block' },
  { slug: 'seo', label: 'SEO Metadata' },
  { slug: 'media', label: 'Media Library' }
];

exports.index = (req, res) => {
  res.render('admin/content/index', {
    layout: 'layouts/admin',
    title: 'Content Modules',
    modules
  });
};
