function requireRole(role) {
  return function checkRole(req, res, next) {
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
    if (req.session.perfil !== role) {
      if (
        req.path.startsWith("/api/") ||
        req.originalUrl.startsWith("/api/") ||
        (req.headers.accept && req.headers.accept.includes("application/json"))
      ) {
        return res
          .status(403)
          .json({ success: false, erro: "Sem permissao para esta operacao." });
      }
      return res.status(403).send("Acesso negado.");
    }
    return next();
  };
}

module.exports = { requireRole };
