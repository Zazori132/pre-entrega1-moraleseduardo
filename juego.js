// Variables globales
let numeroSecreto = null; // Valor predeterminado como null
const intentosMaximos = 10;
let intentosRealizados = 0;
const suposicionesAnteriores = [];
let nivelDificultad = 100; // Nivel de dificultad por defecto

// Obtener elementos del DOM
const suposicionInput = document.getElementById("suposicionInput");
const adivinarBtn = document.getElementById("adivinarBtn");
const resultadoMensaje = document.getElementById("resultadoMensaje");
const suposicionesAnterioresList = document.getElementById("suposicionesAnteriores");
const modal = document.getElementById("modal");
const facilBtn = document.getElementById("facilBtn");
const moderadoBtn = document.getElementById("moderadoBtn");
const dificilBtn = document.getElementById("dificilBtn");

// Función para generar un número aleatorio dentro del rango de dificultad
function generarNumeroSecreto() {
    return Math.floor(Math.random() * nivelDificultad) + 1;
}

// Función para verificar la suposición del usuario
function verificarSuposicion(suposicionUsuario, numeroSecreto) {
    const resultado = suposicionUsuario === numeroSecreto ? "correcta" : suposicionUsuario < numeroSecreto ? "mayor" : "menor";
    return resultado;
}

// Función para mostrar resultados y almacenar suposiciones en localStorage
function realizarSuposicion() {
    const suposicionUsuario = parseInt(suposicionInput.value);

    if (isNaN(suposicionUsuario)) {
        alert("Por favor, ingresa un número válido.");
        return;
    }

    const resultado = verificarSuposicion(suposicionUsuario, numeroSecreto);
    resultadoMensaje.textContent = `Tu suposición (${suposicionUsuario}) es ${resultado}.`;

    const suposicion = { numero: suposicionUsuario, resultado };
    suposicionesAnteriores.push(suposicion);

    // Almacenar la suposición en localStorage
    localStorage.setItem("suposicion_" + new Date().getTime(), JSON.stringify(suposicion));

    if (resultado === "correcta" || intentosRealizados === intentosMaximos) {
        mostrarResultados();
        return;
    }

    intentosRealizados++;
}

// Función para mostrar resultados y cargar suposiciones anteriores desde localStorage
function mostrarResultados() {
    resultadoMensaje.textContent = "";

    const mensaje = intentosRealizados === intentosMaximos ?
        `Lo siento, has agotado tus ${intentosMaximos} intentos. El número correcto era ${numeroSecreto}.` :
        `¡Felicitaciones! Adivinaste el número en ${intentosRealizados + 1} intentos.`;

    resultadoMensaje.textContent = mensaje;

    suposicionesAnterioresList.innerHTML = "";
    suposicionesAnteriores.forEach((suposicion) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Suposición (${suposicion.numero}): ${suposicion.resultado}`;
        suposicionesAnterioresList.appendChild(listItem);
    });

    // Mostrar modal para seleccionar nivel de dificultad y reiniciar juego
    modal.style.display = "block";
}

// Agregar un evento click al botón de adivinar
adivinarBtn.addEventListener("click", realizarSuposicion);

// Recuperar las suposiciones almacenadas en localStorage al cargar la página
window.onload = function () {
    cargarSuposicionesAnteriores();
};

function cargarSuposicionesAnteriores() {
    const suposicionesAlmacenadas = Object.keys(localStorage)
        .filter(key => key.startsWith("suposicion_"))
        .map(key => JSON.parse(localStorage.getItem(key)));

    suposicionesAnteriores.push(...suposicionesAlmacenadas);
    mostrarResultados();
}

// Función para reiniciar el juego y seleccionar nivel de dificultad
function reiniciarJuego() {
    // Ocultar modal
    modal.style.display = "none";

    // Genera un nuevo número secreto
    numeroSecreto = generarNumeroSecreto();

    // Reinicia las variables
    intentosRealizados = 0;
    suposicionesAnteriores.length = 0; // Limpia el array de suposiciones anteriores

    // Limpia los mensajes en el DOM
    resultadoMensaje.textContent = "";

    // Limpia la lista de suposiciones anteriores
    suposicionesAnterioresList.innerHTML = "";

    // Habilita el botón de adivinar
    adivinarBtn.disabled = false;
}

// Agregar eventos para seleccionar el nivel de dificultad
facilBtn.addEventListener("click", function () {
    nivelDificultad = 10;
    reiniciarJuego();
});

moderadoBtn.addEventListener("click", function () {
    nivelDificultad = 50;
    reiniciarJuego();
});

dificilBtn.addEventListener("click", function () {
    nivelDificultad = 100;
    reiniciarJuego();
});
