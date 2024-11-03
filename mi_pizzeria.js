// Regentamos una pizzeria que ofrece pizzas a gusto del consumidor.

// Por tanto necesitamos un menú para que elija:

// 1) el tipo de masa: solo puede elejir uno

// 2) los ingredientes: puede elegir cualquiera de ellos, incluso  más de uno, pero solo una vez cada uno.

// cada ingrediente debe mostrar su precio incrementado un 20% de beneficio + 25% gastos diversos, todo ello por un 4% de IVA
// (estos porcentajes no los ve el cliente)

// Al final aparece el contenido del pedido y el precio total.
// Se guarda la información en el fichero pedido.txt

// El ejercicio se entrega así:
// node_tu_nombre_pizzerria.zip

// *******************************************************************************************************************************************************************************

// *********************************************************************************** Pizeeria ***********************************************************************************


//importacion del modulo readline
const readline = require('readline');
//importacion del modulo fs
const fs = require('fs');

// jalar la masa y condimentos desde el archivo ingredientes
const { masa, condimentos } = require('./ingredientes.js');

// Transformar la estructura de 'condimentos' para que sea un array de objetos { nombre, precio }
const ingredientes = Object.entries(condimentos[0]).map(([nombre, precio]) => ({ //aceder al primer elemento del array condimentos[0] nombre: precio
    nombre,
    precio: parseFloat(precio) // Convertir el precio a número para facilitar cálculos
}));


// Mostrar el tabla la informacion de masa e Ingredientes
console.table(masa);
console.table(ingredientes);


// Configurar la interfaz de entrada/salida y permitir al usuario seleccionar desde consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// Función para mostrar el menú de opciones: Tipo de Masa + Ingredientes
function mostrarMenu() {
    console.log("===== * Menú de Pizzas * =====\n");

    console.log("1.Selecciona el Tipos de Masa que deseas:");
    masa.forEach((item, index) => {
        console.log(`${index + 1}. ${item.tipo} `);
    });

    console.log("\n2. Selecciona el tipo de Ingredientes que deseas agregar:");
    ingredientes.forEach((item, index) => {

        console.log(`${index + 1}. ${item.nombre}`);
    });

    console.log("\n=========== **************** ==============\n");
}

// Mostrar el menú antes de proceder
mostrarMenu();


// Función para calcular el precio final incluyendo márgenes y IVA
function calcularPrecioBase(precio) {
    const beneficio = precio * 0.20; // 20% de beneficio
    const gastosDiversos = precio * 0.25; // 25% de gastos diversos
    const precioConMargen = precio + beneficio + gastosDiversos;
    const precioConIva = precioConMargen * 1.04; // 4% de IVA
    return precioConIva; //retorn el precio final
}

// Mostrar opciones de masas
function mostrarOpciones_masa() {
    console.log("Seleccione el tipo de masa:");
    masa.forEach((item, index) => {
        console.log(`${index + 1}. ${item.tipo}`);
    });
}

// Mostrar opciones de condimentos
function mostrarOpciones_ingrediente() {
    console.log("Seleccione los tipos de ingredientes de:");
    ingredientes.forEach((item, index) => {
        console.log(`${index + 1}. ${item.nombre}`);
    });
}

// Manejar la selección de masa
function seleccionarMasa(callback) {
    rl.question('\nIngrese el número del tipo de masa que desea (solo puede seleccionar 1 masa ): ', (respuesta) => {
        const seleccion = parseInt(respuesta) - 1;
        if (seleccion >= 0 && seleccion < masa.length) {
            callback(masa[seleccion]);
        } else {
            console.log('Opción no válida. Por favor, seleccione un número válido.');
            seleccionarMasa(callback);
        }
    });
}

// Funcion selección de ingredientes
function seleccionarIngredientes(callback) {
    rl.question('\nIngrese los números de los ingredientes separados por comas (por ejemplo, 1,2,3 ): ', (respuesta) => {
        // Obtener los índices seleccionados por el usuario
        const indices = respuesta.split(',').map(num => parseInt(num.trim()) - 1);

        // Mapear los índices a los elementos del array 'ingredientes'
        const ingredientesSeleccionados = indices
            .map(index => ingredientes[index]) // Usar 'ingredientes' transformado
            .filter(item => item); // Filtrar elementos que no sean válidos (undefined)

        // Se debe seleccionar al menos 1 ingrediente
        if (ingredientesSeleccionados.length > 0) {
            callback(ingredientesSeleccionados); // Pasar los ingredientes seleccionados a la función callback
        } else {
            console.log('No ha seleccionado los ingredientes válidos. Intentar de nuevo o escribe "Salir".');
            seleccionarIngredientes(callback); // Volver a preguntar en caso de error
        }
    });
}


// *********************************************** Función principal para ejecutar el flujo del pedido
function realizarPedido() {
    // Mostrar opciones de masa primero
    mostrarOpciones_masa();

    // Paso 1: Seleccionar masa
    seleccionarMasa((masaSeleccionada) => {
        console.log(`Has seleccionado la masa: ${masaSeleccionada.tipo}\n`);

        // Mostrar opciones de ingredientes después de seleccionar la masa
        mostrarOpciones_ingrediente();

        // Paso 2: Seleccionar ingredientes
        seleccionarIngredientes((ingredientesSeleccionados) => {

            // console.log(ingredientesSeleccionados);
            // console.log(masaSeleccionada);

            // Calcular el precio total
            const precioMasa = calcularPrecioBase(parseFloat(masaSeleccionada.precio));

            //  console.log(precioMasa);
            const precioIngredientes = ingredientesSeleccionados.reduce((total, item) => {
                return total + calcularPrecioBase(item.precio);
            }, 0);

            const precioTotal = precioMasa + precioIngredientes;

            // Mostrar el resumen del pedido
            console.log("\nResumen del pedido:");
            console.log(`- Masa: ${masaSeleccionada.tipo} - Precio: ${precioMasa.toFixed(2)}€`);
            console.log("- Ingredientes:");
            ingredientesSeleccionados.forEach(item => {
                console.log(`* ${item.nombre} - Precio: ${calcularPrecioBase(item.precio).toFixed(2)}€`);
            });
            console.log(`\nPrecio total: ${precioTotal.toFixed(2)}€`);

            // Guardar el pedido
            guardarPedido(masaSeleccionada, ingredientesSeleccionados, precioTotal);

        });
    });
}

// Guardar el pedido en un archivo
function guardarPedido(masaSeleccionada, ingredientesSeleccionados, precioTotal) {
    const contenidoPedido = `
    Pedido:
    - Masa: ${masaSeleccionada.tipo} - Precio: ${calcularPrecioBase(parseFloat(masaSeleccionada.precio)).toFixed(2)}€
    - Ingredientes:
    ${ingredientesSeleccionados.map(item => {
        return `* ${item.nombre} - Precio: ${calcularPrecioBase(parseFloat(item.precio)).toFixed(2)}€`;
    }).join('\n')}
    \nPrecio total: ${precioTotal.toFixed(2)}€`;

    //guardar en un archivo pedido.txt
    fs.writeFile('pedido.txt', contenidoPedido, 'utf8', (err) => {
        if (err) throw err;
        console.log('\nEl pedido ha sido guardado en el archivo pedido.txt');
        rl.close();
    });
}


// Ejecutar el flujo de pedido desde consola
realizarPedido();
