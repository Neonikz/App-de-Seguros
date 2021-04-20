//Variables
const formulario = document.querySelector('#cotizar-seguro');
//Constructores
function Seguro(marca,year,tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
//Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {
    /*
    1 = 1.15
    2 = 1.05
    3 = 1.35
    */
    let cantidad;
    const base = 2000;
    
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    //Leer el año
    const diferencia = new Date().getFullYear() - this.year;
    //Cada año que la diferencia es mayor el costo va a reducirse un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
    Si el seguro es basico se multiplica por un 30% mas
    Si el seguro es basico se multiplica por un 50% mas
    */
   this.tipo === 'basico' ? cantidad *= 1.3 : cantidad *= 1.5
    return cantidad;
}

function UI() {}

//Llena las opciones de los años
UI.prototype.llenarOpciones = () =>{
    const max = new Date().getFullYear(),
          min = max - 20;
    const selectYear = document.querySelector('#year');
    
    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Muestra las alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje,tipo) => {
    const div = document.createElement('div');
    tipo === 'error' ? div.classList.add('error') : div.classList.add('correcto');
    div.classList.add('mensaje','mt-10');
    div.textContent = mensaje;

    //Insertar en el HTML
    formulario.insertBefore(div, document.querySelector('#resultado'));

    //Elimina el msj
    setTimeout(() => {
        div.remove();
    }, 2000);
}

UI.prototype.mostrarResultado = (total,seguro) =>{
    const {marca,year,tipo} = seguro;
    
    let textoMarca;

    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }
    //Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');
    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-bold"> ${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-bold"> ${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-bold capitalize"> ${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-bold"> $${total}</span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    
    //Mostrar el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    
    setTimeout(() => {
        spinner.style.display = 'none'; //Se borra el spinner
        resultadoDiv.appendChild(div);  //Se muestra el resultado
    }, 2000);
}

//Instanciar UI
const ui = new UI();


document.addEventListener('DOMContentLoaded', () =>{
    ui.llenarOpciones();    //Llena el select con los años
})

eventListeners();
function eventListeners() {
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    //Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;

    //Leer el año seleccionado
    const year = document.querySelector('#year').value;

    //Leer el tipo de cobertura seleccionada
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    
    if (!marca || !year || !tipo){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error') 
        return;
    }
        
    ui.mostrarMensaje('Cotizando...', 'exito')

    //Ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if (resultados != null) {
        resultados.remove();
    }

    //Instanciar el seguro
    const seguro = new Seguro(marca,year,tipo);
    
    const total = seguro.cotizarSeguro();


    //Utilizar el prototype que va a cotizar
    ui.mostrarResultado(total,seguro);
    
}