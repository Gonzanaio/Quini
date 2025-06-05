function quini() {
  const carton = [];
  for (let i = 0; i < 6; i++) {
    let numero = Math.floor(Math.random() * 10) + 1;
    carton[i] = numero;
  }
  return carton;
}

function verificarApuesta(carton, respuesta) {
  let aciertos = 0;
  for (let i = 0; i < respuesta.length; i++) {
    if (carton.includes(respuesta[i])) {
      aciertos++;
    }
  }
  if (aciertos === 6) {
    alert("¡Felicidades! Has acertado todos los números.");
  } else {
    alert(`Has acertado ${aciertos} números.`);
  }
}
function main() {
  let carton = quini();
  let respuesta = prompt("ingresa 6 numeros del 1 al 10 separados por comas:");
  respuesta = respuesta.split(",").map((num) => parseInt(num.trim(), 10));
  verificarApuesta(carton, respuesta);
  console.log("Cartón generado:", carton);
  console.log("Tu apuesta:", respuesta);
}

main();
