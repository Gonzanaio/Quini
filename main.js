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
    swal("🎉 ¡Felicidades!", "Has acertado todos los números 🎯", "success");
  } else if (aciertos === 0) {
    swal("¡Ups, Lo siento!", "No has acertado ningún número.😢", "error");
  } else {
    swal(
      "¡Buen intento!",
      `Has acertado ${aciertos} número${aciertos !== 1 ? "s" : ""}.🎯`,
      "success"
    );
  }

  guardarApuesta(carton, respuesta);
}

async function mostrarSorteo(carton, valores) {
  const resultado = document.getElementById("result");
  resultado.innerHTML = "";
  const h2 = document.createElement("h2");
  h2.textContent = "Resultados";
  resultado.appendChild(h2);
  const p = document.createElement("p");
  resultado.appendChild(p);

  for (let i = 0; i < carton.length; i++) {
    const numero = carton[i];
    await new Promise((res) => setTimeout(res, 1000));

    const span = document.createElement("span");
    span.textContent = numero;

    span.className = valores.includes(numero) ? "acierto" : "error";

    p.appendChild(span);
    if (i < carton.length - 1) {
      p.appendChild(document.createTextNode(" - "));
    }
    "Número sorteado:", numero;
  }
  verificarApuesta(carton, valores);
  mostrarHistorial(); // Actualiza el historial después de mostrar el sorteo
}

function guardarApuesta(carton, valores) {
  const apuestasGuardadas = JSON.parse(localStorage.getItem("apuestas")) || [];

  apuestasGuardadas.push({
    numeros: valores,
    aciertos: valores.filter((num) => carton.includes(num)).length,
    fecha: new Date().toLocaleString(),
  });
  localStorage.setItem("apuestas", JSON.stringify(apuestasGuardadas));
}

//----------------- Carga de apuestas guardadas -----------------

function mostrarHistorial() {
  const contenedor = document.getElementById("lasApuestas");
  const apuestas = JSON.parse(localStorage.getItem("apuestas")) || [];
  const boton = document.getElementById("btn-historial");

  const botonOculto =
    contenedor.style.display === "none" || contenedor.style.display === "";

  if (botonOculto) {
    contenedor.style.display = "block";
    boton.textContent = "Ocultar historial";

    if (apuestas.length === 0) {
      contenedor.innerHTML = "<p>No hay apuestas registradas.</p>";
      return;
    }

    // Armamos una lista
    let cantApuestas = `<h3>Apuestas realizadas ${apuestas.length}</h3>`;
    let html = "<ul>";
    apuestas.forEach((apuesta, historial) => {
      html += `<li>
      <div class="jugada">
        <strong>Jugada : ${historial + 1}</strong> 
        <p>${apuesta.numeros.join(" - ")}</p>
        <p>${apuesta.aciertos} aciertos</p> 
        <em>(${apuesta.fecha})</em>
      </div>
      </li>`;
    });
    html += "</ul>";
    contenedor.innerHTML = cantApuestas + html;
  } else {
    boton.textContent = "Mostrar historial";
    contenedor.style.display = "none";
  }
}

// Limpiar LocalStorage
function limpiarHistorial() {
  localStorage.removeItem("apuestas");
  alert("Historial de apuestas reiniciado.");
  mostrarHistorial(); // Actualiza el historial después de limpiar
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
  // Validación de los números ingresados
  const carton = quini();

  mostrarSorteo(carton, valores); // Muestra el sorteo en vivo
});

// ------- cambio de colores de fondo al pasar el mouse -------

const div = document.getElementById("container");
let intervalId;

function colorRandom() {
  const r = Math.floor(Math.random() * 175) + 100;
  const g = Math.floor(Math.random() * 175) + 100;
  const b = Math.floor(Math.random() * 175) + 100;
  return `rgb(${r}, ${g}, ${b})`;
}

div.addEventListener("mouseenter", () => {
  intervalId = setInterval(() => {
    div.style.backgroundColor = colorRandom();
  }, 400);
});

div.addEventListener("mouseleave", () => {
  clearInterval(intervalId);
});

// ------- Mostrar formulario al hacer clic en el botón "Comenzar" -------

document.addEventListener("DOMContentLoaded", () => {
  const btnComenzar = document.getElementById("btn-comenzar");
  const formElement = document.getElementById("form");
  let formVisible = false;
  btnComenzar.addEventListener("click", () => {
    btnComenzar.style.display = "none"; // Oculta el botón al hacer clic
    if (!formVisible) {
      const formDiv = document.createElement("div");
      formDiv.className = "inputs";

      for (let i = 1; i <= 6; i++) {
        const input = document.createElement("input");
        input.type = "number";
        input.id = `input${i}`;
        input.min = "0";
        input.max = "99";
        input.required = true;
        formDiv.appendChild(input);
      }
      formElement.appendChild(formDiv);
      const btnSubmit = document.createElement("button");
      btnSubmit.type = "submit";
      btnSubmit.textContent = "Enviar Apuesta";
      formElement.appendChild(btnSubmit);
      formVisible = true;
      btnSubmit.addEventListener("click", () => {
        if (formVisible) {
          btnSubmit.textContent = "Reitentar Apuesta";
        }
      });
    }
  });
});

// ------- prueba api ---------

async function datoCurioso() {
  const numeroSuerte = parseInt(Math.floor(Math.random() * 99) + 1);
  try {
    const respuesta = await fetch(`http://numbersapi.com/${numeroSuerte}`);
    const data = await respuesta.text();
    document.getElementById(
      "dato"
    ).innerHTML = `<p class="dato-curioso">${data}</p>`;
  } catch (error) {
    console.error("Error al obtener el dato curioso:", error);
    document.getElementById("dato").innerText =
      "No se pudo obtener el dato curioso.";
  }
}
datoCurioso(); // Llama a la función para mostrar el dato curioso al cargar la página
