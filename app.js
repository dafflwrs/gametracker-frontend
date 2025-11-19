const gameForm = document.getElementById('gameForm');
const gamesList = document.getElementById('gamesList');

let games = JSON.parse(localStorage.getItem('games')) || [];
let editIndex = null;

function saveGames() {
  localStorage.setItem('games', JSON.stringify(games));
}

function renderGames() {
  gamesList.innerHTML = '';

  games.forEach((game, index) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      ${game.image ? `<img src="${game.image}" alt="${game.name}">` : ''}
      <h3>${game.name}</h3>
      <div class="info-block"><span>Estado:</span> ${game.status}</div>
      <div class="info-block"><span>Horas:</span> ${game.hours}</div>
      <div class="info-block"><span>Puntuación:</span> ${game.score}</div>
      <div class="review-block"><span>Reseña:</span> ${game.review || ''}</div>
      <button class="delete-btn" onclick="deleteGame(${index})">×</button>
      <button class="edit-btn" onclick="editGame(${index})">✎</button>
    `;
    gamesList.appendChild(card);
  });
}

function deleteGame(index) {
  games.splice(index, 1);
  saveGames();
  renderGames();
}

function editGame(index) {
  const game = games[index];
  document.getElementById('gameName').value = game.name;
  document.getElementById('gameHours').value = game.hours;
  document.getElementById('gameScore').value = game.score;
  document.getElementById('gameReview').value = game.review;
  document.getElementById('gameStatus').value = game.status;
  editIndex = index;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

gameForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('gameName').value;
  const hours = parseInt(document.getElementById('gameHours').value) || 0;
  let score = parseInt(document.getElementById('gameScore').value);
  if (isNaN(score) || score < 0) score = 0;
  if (score > 10) score = 10;
  const review = document.getElementById('gameReview').value;
  const status = document.getElementById('gameStatus').value;
  const imageFile = document.getElementById('gameImage').files[0];

  const saveGame = (imageData) => {
    if (editIndex !== null) {
      games[editIndex] = { name, hours, status, image: imageData || games[editIndex].image, score, review };
      editIndex = null;
    } else {
      games.push({ name, hours, status, image: imageData || '', score, review });
    }
    saveGames();
    renderGames();
    gameForm.reset();
  }

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      saveGame(e.target.result);
    }
    reader.readAsDataURL(imageFile);
  } else {
    saveGame('');
  }
});

// Inicializar
renderGames();
