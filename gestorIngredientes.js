// modulos de node 
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Ruta al archivo ingredientes.js
const filePath = path.join(__dirname, 'ingredientes.js');

// Crear una interfaz de readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para leer los ingredientes desde el archivo
function leerIngredientes() {
    const data = require(filePath);
    return {
        masa: data.masa,
        condimentos: data.condimentos[0] // Retorna el primer objeto que contiene los ingredientes
    };
}

// Función para guardar los ingredientes en el archivo
function guardarIngredientes(ingredientes) {
    const data = leerIngredientes(); // Lee la masa actual
    const contenido = `const masa = ${JSON.stringify(data.masa, null, 4)};
    \n\nconst condimentos = [\n{\n${Object.entries(ingredientes).map(([nombre, precio]) => `"${nombre}": "${precio}"`).join(',\n')}\n},\n];
    \n\nmodule.exports = {masa, condimentos};`;
    fs.writeFileSync(filePath, contenido, 'utf8');
}

// Función para agregar un nuevo ingrediente
function agregarIngrediente(nombre, precio) {
    const { condimentos } = leerIngredientes();
    condimentos[nombre] = precio; // Agrega el nuevo ingrediente
    guardarIngredientes(condimentos);
    console.log(`Ingrediente "${nombre}" agregado con éxito.`);
}

// Función para editar un ingrediente existente
function editarIngrediente(nombre, nuevoPrecio) {
    const { condimentos } = leerIngredientes();
    if (condimentos[nombre]) {
        condimentos[nombre] = nuevoPrecio; // Actualiza el precio del ingrediente
        guardarIngredientes(condimentos);
        console.log(`Ingrediente "${nombre}" editado con éxito.`);
    } else {
        console.log(`El ingrediente "${nombre}" no existe.`);
    }
}

// Función para eliminar un ingrediente
function eliminarIngrediente(nombre) {
    const { condimentos } = leerIngredientes();
    if (condimentos[nombre]) {
        delete condimentos[nombre]; // Elimina el ingrediente
        guardarIngredientes(condimentos);
        console.log(`Ingrediente "${nombre}" eliminado con éxito.`);
    } else {
        console.log(`El ingrediente "${nombre}" no existe.`);
    }
}

// Función para mostrar el menú y manejar las elecciones
function mostrarMenu() {
    console.log("\nElige una opción:");
    console.log("1. Agregar ingrediente");
    console.log("2. Editar ingrediente");
    console.log("3. Eliminar ingrediente");
    console.log("4. Salir");

    rl.question("Opción: ", (opcion) => {
        switch (opcion) {
            case '1':
                rl.question("Ingresa el nombre del ingrediente: ", (nombre) => {
                    rl.question("Ingresa el precio del ingrediente: ", (precio) => {
                        agregarIngrediente(nombre, precio);
                        mostrarMenu(); // Vuelve a mostrar el menú
                    });
                });
                break;
            case '2':
                rl.question("Ingresa el nombre del ingrediente a editar: ", (nombre) => {
                    rl.question("Ingresa el nuevo precio: ", (nuevoPrecio) => {
                        editarIngrediente(nombre, nuevoPrecio);
                        mostrarMenu(); // Vuelve a mostrar el menú
                    });
                });
                break;
            case '3':
                rl.question("Ingresa el nombre del ingrediente a eliminar: ", (nombre) => {
                    eliminarIngrediente(nombre);
                    mostrarMenu(); // Vuelve a mostrar el menú
                });
                break;
            case '4':
                console.log("Saliendo...");
                rl.close();
                break;
            default:
                console.log("Opción no válida. Intenta de nuevo.");
                mostrarMenu(); // Vuelve a mostrar el menú
                break;
        }
    });
}

// Iniciar el menú
mostrarMenu();