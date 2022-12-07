const { Router } = require("express");
const router = Router();
const Contenedor = require("/PROGRAMACION/BACK END/prueba 1/controllers/SQLController.js");
const options = require("/PROGRAMACION/BACK END/prueba 1/controllers/options.js");
const productos = new Contenedor(options.mysql, "productos");
const notFound = { error: "Producto no encontrado" };

/* ok: 200
   created: 201
   no content: 204
   bad request: 400
   not found: 404
   internal server error: 500
    */

router.get("/", async (req, res) => {
    const arrayProductos = await productos.getAll();
    console.log(arrayProductos);
    res.render("productos", {
        productos: arrayProductos,
        style: "productos.css",
        title: "Productos con Handlebars",
    });
});

module.exports = router;