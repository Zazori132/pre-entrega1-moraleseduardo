// Variables globales
let numeroSecreto = null;
const intentosMaximos = 10;
let intentosRealizados = 0;
const suposicionesAnteriores = [];
let nivelDificultad = 100; // Nivel de dificultad por defecto
let temporizador;

// Obtener elementos del DOM
const suposicionInput = document.getElementById("suposicionInput");
const adivinarBtn = document.getElementById("adivinarBtn");
const resultadoMensaje = document.getElementById("resultadoMensaje");
const suposicionesAnterioresList = document.getElementById("suposicionesAnteriores");
const modal = document.getElementById("modal");
const facilBtn = document.getElementById("facilBtn");
const moderadoBtn = document.getElementById("moderadoBtn");
const dificilBtn = document.getElementById("dificilBtn");
const usuariosJugados = document.getElementById("usuariosJugados");
const eliminarRegistrosBtn = document.getElementById("eliminarRegistrosBtn");

// Obtener botones para funcionalidades adicionales
const guardarJuegoBtn = document.getElementById("guardarJuegoBtn");
const cargarJuegoBtn = document.getElementById("cargarJuegoBtn");
const consejosBtn = document.getElementById("consejosBtn");

// Variable para almacenar el usuario actual (puedes obtenerlo de alguna forma, como un inicio de sesión)
let usuarioActual = "Usuario Ejemplo";

// Función para generar un número aleatorio dentro del rango de dificultad
function generarNumeroSecreto() {
    return Math.floor(Math.random() * nivelDificultad) + 1;
}

// Función para verificar la suposición del usuario
function verificarSuposicion(suposicionUsuario, numeroSecreto) {
    if (suposicionUsuario === numeroSecreto) {
        return "correcta";
    } else if (suposicionUsuario < numeroSecreto) {
        return "mayor";
    } else {
        return "menor";
    }
}

// Función para mostrar mensajes en el resultado
function mostrarMensaje(mensaje, tipo = "info") {
    resultadoMensaje.textContent = mensaje;
    resultadoMensaje.className = `text-${tipo}`;
}

// Función para actualizar la lista de suposiciones anteriores en el DOM
function actualizarListaSuposiciones() {
    suposicionesAnterioresList.innerHTML = "";

    suposicionesAnteriores.forEach((suposicion) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Suposición (${suposicion.numero}): ${suposicion.resultado}`;
        suposicionesAnterioresList.appendChild(listItem);
    });
}

// Función para mostrar el modal y bloquear el juego
function mostrarModal() {
    modal.style.display = "block";
    adivinarBtn.disabled = true;
}

// Función para ocultar el modal y reanudar el juego
function ocultarModal() {
    modal.style.display = "none";
    adivinarBtn.disabled = false;
}

// Función para reiniciar el juego
function reiniciarJuego(nuevoNivelDificultad = null) {
    ocultarModal();
    if (nuevoNivelDificultad !== null) {
        nivelDificultad = nuevoNivelDificultad;
    }
    numeroSecreto = generarNumeroSecreto();
    intentosRealizados = 0;
    suposicionesAnteriores.length = 0;
    mostrarMensaje("");
    actualizarListaSuposiciones();
    iniciarTemporizador(60);
}

// Función para iniciar el temporizador
function iniciarTemporizador(tiempoLimite) {
    const contadorTiempo = document.getElementById("contadorTiempo");
    let tiempoRestante = tiempoLimite;

    function actualizarTiempo() {
        if (tiempoRestante === 0) {
            mostrarMensaje("Tiempo agotado. Reiniciando el juego.", "warning");
            reiniciarJuego();
        } else {
            contadorTiempo.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
            tiempoRestante--;
            temporizador = setTimeout(actualizarTiempo, 1000);
        }
    }

    clearInterval(temporizador); // Limpiar temporizador anterior si existe
    actualizarTiempo();
}

// Event listener para el botón de adivinar
adivinarBtn.addEventListener("click", () => {
    const suposicionUsuario = parseInt(suposicionInput.value);

    if (isNaN(suposicionUsuario)) {
        mostrarMensaje("Por favor, ingresa un número válido.", "danger");
        return;
    }

    const resultado = verificarSuposicion(suposicionUsuario, numeroSecreto);
    mostrarMensaje(`Tu suposición (${suposicionUsuario}) es ${resultado}.`);

    const suposicion = { numero: suposicionUsuario, resultado };
    suposicionesAnteriores.push(suposicion);

    if (resultado === "correcta" || intentosRealizados === intentosMaximos) {
        mostrarResultados();
    } else {
        intentosRealizados++;
    }

    actualizarListaSuposiciones();
});

// Event listener para los botones de dificultad
facilBtn.addEventListener("click", () => {
    reiniciarJuego(10);
});

moderadoBtn.addEventListener("click", () => {
    reiniciarJuego(50);
});

dificilBtn.addEventListener("click", () => {
    reiniciarJuego(100);
});

// Event listener para el botón de eliminar registros de usuarios
eliminarRegistrosBtn.addEventListener("click", () => {
    localStorage.clear();
    suposicionesAnteriores.length = 0;
    actualizarListaSuposiciones();
    actualizarCantidadUsuarios();
});

// Event listener para el botón de guardar juego en curso
guardarJuegoBtn.addEventListener("click", () => {
    localStorage.setItem("juegoEnCurso", JSON.stringify({ numeroSecreto, intentosRealizados, suposicionesAnteriores }));
    mostrarMensaje("El juego en curso ha sido guardado. Puedes continuar más tarde.", "success");
});

// Event listener para el botón de cargar juego en curso
cargarJuegoBtn.addEventListener("click", () => {
    const juegoGuardado = JSON.parse(localStorage.getItem("juegoEnCurso"));

    if (juegoGuardado) {
        numeroSecreto = juegoGuardado.numeroSecreto;
        intentosRealizados = juegoGuardado.intentosRealizados;
        suposicionesAnteriores.length = 0;
        suposicionesAnteriores.push(...juegoGuardado.suposicionesAnteriores);
        mostrarMensaje("Juego en curso cargado. ¡Continúa jugando!", "success");
    } else {
        mostrarMensaje("No se encontró ningún juego en curso guardado.", "danger");
    }

    actualizarListaSuposiciones();
    iniciarTemporizador(60);
});

// Event listener para el botón de consejos
consejosBtn.addEventListener("click", () => {
    proporcionarConsejos();
});


// Función para proporcionar consejos basados en suposiciones anteriores
function proporcionarConsejos() {
    if (suposicionesAnteriores.length === 0) {
        mostrarMensaje("No tengo consejos para ti en este momento. ¡Adivina un número!", "info");
        return;
    }

    const ultimaSuposicion = suposicionesAnteriores[suposicionesAnteriores.length - 1];

    if (ultimaSuposicion.resultado === "mayor") {
        mostrarMensaje("Tu última suposición fue demasiado alta. Intenta con un número más bajo.", "info");
    } else if (ultimaSuposicion.resultado === "menor") {
        mostrarMensaje("Tu última suposición fue demasiado baja. Intenta con un número más alto.", "info");
    } else {
        mostrarMensaje("¡Tu última suposición fue correcta! ¡Sigue así!", "success");
    }
}

// Función para actualizar la cantidad de usuarios jugados
function actualizarCantidadUsuarios() {
    const usuarios = Object.keys(localStorage).filter(key => key.startsWith("suposicion_")).length;
    usuariosJugados.textContent = `Usuarios que jugaron: ${usuarios}`;
}

// Al cargar la página, intenta cargar un juego en curso si existe
window.onload = function () {
    actualizarCantidadUsuarios();
    const juegoGuardado = JSON.parse(localStorage.getItem("juegoEnCurso"));

    if (juegoGuardado) {
        numeroSecreto = juegoGuardado.numeroSecreto;
        intentosRealizados = juegoGuardado.intentosRealizados;
        suposicionesAnteriores.length = 0;
        suposicionesAnteriores.push(...juegoGuardado.suposicionesAnteriores);
        mostrarMensaje("Juego en curso cargado. ¡Continúa jugando!", "success");
        actualizarListaSuposiciones();
        iniciarTemporizador(60);
    } else {
        mostrarMensaje("No se encontró ningún juego en curso guardado.", "info");
    }
};

// Ruta al archivo JSON local (ajusta la ruta según la ubicación de tu archivo)
const jsonFilePath = "data.json";

// Función para cargar datos desde el archivo JSON local
function cargarDatosDesdeJSON() {
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`La solicitud falló con estado ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Procesar los datos obtenidos del archivo JSON
            console.log(data);

            // Aquí puedes realizar cualquier operación que necesites con los datos
        })
        .catch(error => {
            console.error("Error al cargar datos desde el archivo JSON:", error);
        });
}

// Llamar a la función para cargar datos desde el archivo JSON cuando sea necesario
cargarDatosDesdeJSON();

// Función para aplicar efecto visual al adivinar correctamente
function aplicarEfectoVictoria() {
    const resultadoMensaje = document.getElementById("resultadoMensaje");
    resultadoMensaje.classList.add("text-success", "animated", "fadeIn"); // Agregar clases de animación
    setTimeout(() => {
        resultadoMensaje.classList.remove("text-success", "animated", "fadeIn"); // Quitar las clases después de un tiempo
    }, 2000); // Duración de la animación en milisegundos
}

// Función para mostrar mensajes de aliento
function mostrarMensajeAliento(mensaje) {
    const mensajeAliento = document.getElementById("mensajeAliento");
    mensajeAliento.textContent = mensaje;
    mensajeAliento.style.display = "block";

    // Ocultar el mensaje de aliento después de un tiempo
    setTimeout(() => {
        mensajeAliento.style.display = "none";
    }, 3000); // Duración del mensaje de aliento en milisegundos
}

// Event listener para el botón de consejos
consejosBtn.addEventListener("click", () => {
    proporcionarConsejos();
    mostrarMensajeAliento("¡Sigue intentándolo! ¡Tú puedes hacerlo!");
});
