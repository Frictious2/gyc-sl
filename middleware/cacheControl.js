function setNoStoreHeaders(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Vary', 'Cookie, Accept-Encoding');
}

function setRevalidateHeaders(res) {
  res.setHeader('Cache-Control', 'no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Vary', 'Cookie, Accept-Encoding');
}

function adminNoStore(req, res, next) {
  setNoStoreHeaders(res);
  next();
}

function publicDynamicCacheControl(req, res, next) {
  if (req.path.startsWith('/admin')) {
    return next();
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    setRevalidateHeaders(res);
  } else {
    setNoStoreHeaders(res);
  }

  next();
}

module.exports = {
  adminNoStore,
  publicDynamicCacheControl
};
