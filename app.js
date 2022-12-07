/* Importacion de librerias internas y externas */
const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const bp = require("body-parser");
const routers = require("./public/routers");
const handlebars = require("express-handlebars");
const Contenedor = require("./controllers/SQLController.js");
const options = require("./controllers/options.js");
const moment = require("moment/moment");
const productos = new Contenedor(options.mysql, "productos");
const messages = new Contenedor(options.sqlite3, "mensajes");

/* Inicializacion de la configuracion */
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;

/* middlewares incorporados */
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.engine(
    "hbs",
    handlebars.engine({
        extname: "hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views",
    })
);

app.set("views", "./views");
app.set("view engine", "hbs");

app.use("/", routers);
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("welcome", {
        style: "welcome.css",
        title: "Bienvenido",
    });
});

app.post("/", async (req, res) => {
    console.log(`post req recibida con exito`);
    const data = req.body;
    console.log(data);
    const nuevoProducto = await productos.save(data);
    !data && res.status(204).json(notFound);
    res.status(201).render("productos", {});
});

httpServer.listen(PORT, () => {
    console.log(
        `Servidor http escuchando en el puerto ${httpServer.address().port}`
    );
    console.log(`http://localhost:${httpServer.address().port}`);
});
httpServer.on("error", error => console.log(`Error en servidor: ${error}`));

io.on("connection", async socket => {
    console.log("Nuevo cliente conectado");

    /* cargar los productos */
    const listaProductos = await productos.getAll();
    socket.emit("new-connection", listaProductos);
    socket.on("new-product", data => {
        productos.save(data);
        io.sockets.emit("producto", data);
        
    });


    //Para enviar todos los mensajes en la primera conexion
    const listaMensajes = await messages.getAll();
    socket.emit('messages', listaMensajes);

  //Evento para recibir nuevos mensajes
    socket.on('new-message', async data => {
        data.time = moment(new Date()).format('DD/MM/YYYY hh:mm:ss');
        await messages.saveMessages(data);
        const listaMensajes = await messages.getAll();
        io.sockets.emit('messages', listaMensajes);
    });
});
