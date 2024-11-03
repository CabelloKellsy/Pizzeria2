const { agregarIngrediente, editarIngrediente, eliminarIngrediente } = require('./gestorIngredientes');

// Agregar un ingrediente
agregarIngrediente('tomate', '1.5');

// Editar un ingrediente
editarIngrediente('tomate', '2.0');

// Eliminar un ingrediente
eliminarIngrediente('tomate');