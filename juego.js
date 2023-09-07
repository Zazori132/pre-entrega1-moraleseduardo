// Generar un número aleatorio entre 1 y 50
function generarNumeroSecreto() {
  return Math.floor(Math.random() * 50) + 1;
}

// Verificar si la suposición es correcta y proporcionar pistas
function verificarSuposicion(suposicionUsuario, numeroSecreto) {
  if (suposicionUsuario === numeroSecreto) {
    return "¡Felicitaciones! Adivinaste el número en " + (intentosRealizados + 1) + " intentos.";
  } else if (suposicionUsuario < numeroSecreto) {
    return "El número es mayor.";
  } else {
    return "El número es menor.";
  }
}

console.log("¡Bienvenido al juego de adivinar el número!");

const numeroSecreto = generarNumeroSecreto();
const intentosMaximos = 10;
let intentosRealizados = 0;
const suposicionesAnteriores = [];

while (intentosRealizados < intentosMaximos) {
  const suposicionUsuario = parseInt(prompt("Intento " + (intentosRealizados + 1) + ": Adivina el número (entre 1 y 50):"));

  // Manejo de errores si el usuario ingresa algo que no es un número
  if (isNaN(suposicionUsuario)) {
    console.log("Por favor, ingresa un número válido.");
    continue;
  }

  suposicionesAnteriores.push(suposicionUsuario);

  const resultado = verificarSuposicion(suposicionUsuario, numeroSecreto);
  console.log(resultado);

  if (suposicionUsuario === numeroSecreto) {
    break;
  }

  intentosRealizados++;
}

if (intentosRealizados === intentosMaximos) {
  console.log("Lo siento, has agotado tus " + intentosMaximos + " intentos. El número correcto era " + numeroSecreto + ".");
}

console.log("Tus suposiciones anteriores fueron: " + suposicionesAnteriores.join(', '));
