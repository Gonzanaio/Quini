function quini() {
  const carton = [];
  for (let i = 0; i < 6; i++) {
    let numero = Math.floor(Math.random() * 99) + 1;
    while (carton.includes(numero)) {
      numero = Math.floor(Math.random() * 99) + 1;
    }
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
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
    const modalContent = document.getElementById("aciertos");
    modalContent.style.display = "block";
    modalElement.innerHTML = `<h2>🎉 ¡Felicidades!</h2> <p>Has acertado todos los números 🎯</p>`;
  } else if (aciertos === 0) {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
    const aciertosElement = document.getElementById("aciertos");
    aciertosElement.style.display = "block";
    aciertosElement.innerHTML = `<h2>¡Ups, Lo siento !</h2> <p>No has acertado ningún número.😢</p>`;
  } else {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
    const aciertosElement = document.getElementById("aciertos");
    aciertosElement.style.display = "block";
    aciertosElement.innerHTML = `<h2>🎉 ¡Felicidades!</h2> <p>Has acertado ${aciertos} número${
      aciertos !== 1 ? "s" : ""
    }.🎯</p>`;
  }
  guardarApuesta(respuesta);
}

function guardarApuesta(valores) {
  const apuestasGuardadas = JSON.parse(localStorage.getItem("apuestas")) || [];

  apuestasGuardadas.push({
    numeros: valores,
    fecha: new Date().toLocaleString(),
  });

  localStorage.setItem("apuestas", JSON.stringify(apuestasGuardadas));
}

//------------------- Cierra modasl -------------------
window.addEventListener("click", (e) => {
  const modalGanador = document.getElementById("modal");
  if (e.target === modal) {
    modalGanador.style.display = "none";
  }
});

//----------------- Carga de apuestas guardadas -----------------

function mostrarHistorial() {
  const contenedor = document.getElementById("lasApuestas");
  const apuestas = JSON.parse(localStorage.getItem("apuestas")) || [];

  if (apuestas.length === 0) {
    contenedor.innerHTML = "<p>No hay apuestas registradas.</p>";
    return;
  }

  // Armamos una lista
  let html = "<ul>";
  apuestas.forEach((apuesta, index) => {
    html += `<li>
      <strong>Jugada ${index + 1}</strong>: 
      [${apuesta.numeros.join(" - ")}] 
      <em>(${apuesta.fecha})</em>
    </li>`;
  });
  html += "</ul>";

  contenedor.innerHTML = html;
}
//----------------- Generación del cartón y verificación de la apuesta -----------------
const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita el envío del formulario
  const valores = [];

  for (let i = 1; i <= 6; i++) {
    const input = document.getElementById(`input${i}`);
    if (input) {
      const numero = parseInt(input.value, 10);
      valores.push(numero);
    } else {
      console.error(`Input con id input${i} no encontrado.`);
    }
  }
  const carton = quini();
  console.log("Cartón generado:", carton);

  verificarApuesta(carton, valores);
  console.log("Tu apuesta:", valores);

  const resultado = document.getElementById("result");

  let cartonHTML = "<p>";
  for (let i = 0; i < carton.length; i++) {
    const numero = carton[i];
    if (valores.includes(numero)) {
      cartonHTML += `<span class="acierto">${numero}</span>`;
    } else {
      cartonHTML += `<spanc class="error">${numero}</span>`;
    }
    if (i < carton.length - 1) cartonHTML += " - ";
  }
  cartonHTML += "</p>";
  resultado.innerHTML = cartonHTML;
  mostrarHistorial(); // Muestra el historial de apuestas
  document.querySelector('button[type="reset"]').style.display = "inline-block";
});

//----------------- Botón de reinicio -----------------
const resetButton = document.querySelector('button[type="reset"]');

resetButton.addEventListener("click", (e) => {
  e.preventDefault();
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  const result = document.getElementById("result");
  result.innerHTML = "";
  const aciertosElement = document.getElementById("aciertos");
  aciertosElement.style.display = "none";
  for (let i = 1; i <= 6; i++) {
    const input = document.getElementById(`input${i}`);
    if (input) {
      input.value = ""; // Limpia los valores de los inputs
    } else {
      console.error(`Input con id input${i} no encontrado.`);
    }
  }
  resetButton.style.display = "none";
});

// ------- cambio de colores de fondo al pasar el mouse -------

const div = document.getElementById("container");
let intervalId;

function getRandomColor() {
  const r = Math.floor(Math.random() * 175) + 100;
  const g = Math.floor(Math.random() * 175) + 100;
  const b = Math.floor(Math.random() * 175) + 100;
  return `rgb(${r}, ${g}, ${b})`;
}

div.addEventListener("mouseenter", () => {
  intervalId = setInterval(() => {
    div.style.backgroundColor = getRandomColor();
  }, 400);
});

div.addEventListener("mouseleave", () => {
  clearInterval(intervalId);
});
