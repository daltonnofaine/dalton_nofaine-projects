function authMiddleware(req, res, next) {
  if (!req.session || !req.session.userId) {
    if (
      req.path.startsWith("/api/") ||
      req.originalUrl.startsWith("/api/") ||
      (req.headers.accept && req.headers.accept.includes("application/json"))
    ) {
      return res
        .status(401)
        .json({ success: false, erro: "Sessao expirada. Faca login novamente." });
    }
    return res.redirect("/auth/login");
  }
  return next();
}

module.exports = authMiddleware;
