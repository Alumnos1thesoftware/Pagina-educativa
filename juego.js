 const gameBoard = document.getElementById('game-board');
const attemptsSpan = document.getElementById('attempts');
const resetButton = document.getElementById('reset-button');

const cardsArray = [
    'NumPy', 'NumPy', 'Pandas', 'Pandas', 'Seaborn', 'Seaborn', 'Requests', 'Requests',
    'Flask', 'Flask', 'Scikit-learn', 'Scikit-learn', 'PyTorch', 'PyTorch', 'SpaCy', 'SpaCy'
]; // Puedes usar emojis, imágenes o lo que quieras

let firstCard = null;
let secondCard = null;
let lockBoard = false; // Evita que el jugador haga clics mientras se voltean las cartas
let attempts = 0;
let matchedPairs = 0;

// --- Función para Barajar las Cartas (Algoritmo Fisher-Yates) ---
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambia elementos
    }
    return array;
}

// --- Función para Crear el Tablero de Juego ---
function createBoard() {
    attempts = 0;
    attemptsSpan.textContent = attempts;
    matchedPairs = 0;
    gameBoard.innerHTML = ''; // Limpia cualquier carta existente

    const shuffledCards = shuffle(cardsArray.slice()); // Baraja una copia del array

    shuffledCards.forEach((cardValue, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardValue; // Guarda el valor de la carta en un atributo de datos
        card.dataset.index = index; // Guarda el índice para referencia

        // Crear el contenido interno de la carta (frente y dorso)
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${cardValue}</div>
                <div class="card-back"></div>
            </div>
        `;

        card.addEventListener('click', flipCard); // Añadir el evento click a cada carta
        gameBoard.appendChild(card);
    });
}

// --- Función para Voltear una Carta ---
function flipCard() {
    if (lockBoard) return; // Si el tablero está bloqueado, no hacer nada
    if (this === firstCard) return; // Evita hacer doble clic en la misma carta

    this.classList.add('flipped'); // Añade la clase 'flipped' para mostrar el contenido

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    attempts++;
    attemptsSpan.textContent = attempts;
    lockBoard = true; // Bloquea el tablero mientras se comparan las cartas

    checkForMatch();
}

// --- Función para Comprobar si Hay un Emparejamiento ---
function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    isMatch ? disableCards() : unflipCards();
}

// --- Función para Desactivar Cartas (cuando hay un emparejamiento) ---
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Añadir clase 'matched' para estilos visuales
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    matchedPairs++;
    if (matchedPairs === cardsArray.length / 2) {
        setTimeout(() => {
            alert(¡Felicidades! Has encontrado todas las parejas en ${attempts} intentos.);
        }, 500); // Pequeño retraso para que se vea la última carta volteada
    }

    resetBoard();
}

// --- Función para Volver a Poner las Cartas Boca Abajo (cuando no hay emparejamiento) ---
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000); // Retraso de 1 segundo antes de voltearlas de nuevo
}

// --- Función para Resetear el Estado del Tablero después de un turno ---
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// --- Evento para el Botón de Reiniciar ---
resetButton.addEventListener('click', createBoard);

// --- Iniciar el Juego al Cargar la Página ---
