require("dotenv").config({ override: true });

const express = require("express");
const session = require("express-session");
const path = require("path");

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const servicosRoutes = require("./routes/servicos");
const clienteRoutes = require("./routes/cliente");
const prestadorRoutes = require("./routes/prestador");
const adminRoutes = require("./routes/admin");
const apiServicosRoutes = require("./routes/api/servicos");
const apiPedidosRoutes = require("./routes/api/pedidos");
const apiPerfilRoutes = require("./routes/api/perfil");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "serv-link-fallback",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  res.locals.sessao = req.session?.userId
    ? {
        userId: req.session.userId,
        nome: req.session.nome,
        perfil: req.session.perfil,
        email: req.session.email,
        avatarUrl: req.session.avatarUrl || null,
      }
    : null;
  next();
});

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/servicos", servicosRoutes);
app.use("/cliente", clienteRoutes);
app.use("/prestador", prestadorRoutes);
app.use("/admin", adminRoutes);
app.use("/api/servicos", apiServicosRoutes);
app.use("/api/pedidos", apiPedidosRoutes);
app.use("/api/perfil", apiPerfilRoutes);

app.use((req, res) => {
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res
      .status(404)
      .json({ success: false, erro: "Recurso nao encontrado." });
  }
  return res.status(404).send("Pagina nao encontrada.");
});

app.listen(PORT, () => {
  console.log(`Serv-Link backend em http://localhost:${PORT}`);
});
