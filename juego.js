// Generar un número aleatorio entre 1 y 50
function generarNumeroSecreto() {
    return Math.floor(Math.random() * 50) + 1;
  }
  
  // Verificar si la suposición es correcta y proporcionar pistas
  function verificarSuposicion(suposicionUsuario, numeroSecreto) {
    if (suposicionUsuario === numeroSecreto) {
      console.log("¡Felicitaciones! Adivinaste el número en " + (intentosRealizados + 1) + " intentos.");
      return true;
    } else if (suposicionUsuario < numeroSecreto) {
      console.log("El número es mayor.");
    } else {
      console.log("El número es menor.");
    }
    return false;
  }
  
  console.log("¡Bienvenido al juego de adivinar el número!");
  
  const numeroSecreto = generarNumeroSecreto();
  const intentosMaximos = 5;
  let intentosRealizados = 0;
  
  while (intentosRealizados < intentosMaximos) {
    const suposicionUsuario = parseInt(prompt("Intento " + (intentosRealizados + 1) + ": Adivina el número (entre 1 y 50):"));
    
    if (verificarSuposicion(suposicionUsuario, numeroSecreto)) {
      break;
    }
    
    intentosRealizados++;
  }
  
  if (intentosRealizados === intentosMaximos) {
    console.log("Lo siento, has agotado tus " + intentosMaximos + " intentos. El número correcto era " + numeroSecreto + ".");
  }
  