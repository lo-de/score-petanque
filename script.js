let score1 = 0;
let score2 = 0;
let roundHistory = [];
let gameMode = "1";
let players = [];
let team1 = [];
let team2 = [];

const selectedPoints = {
  team1: null,
  team2: null,
};

function startGame() {
  gameMode = document.getElementById("gameMode").value;
  const playerInputs = document.querySelectorAll("#players input");
  players = Array.from(playerInputs).map(input => input.value.trim()).filter(name => name !== "");

  const totalPlayers = parseInt(gameMode) * 2;
  if (players.length !== totalPlayers) {
    alert(`Veuillez entrer ${totalPlayers} noms de joueurs.`);
    return;
  }

  team1 = players.slice(0, totalPlayers / 2);
  team2 = players.slice(totalPlayers / 2);

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  displayTeams();
  createPointButtons();
  updateScores();
}

function shuffleTeams() {
  const totalPlayers = parseInt(document.getElementById("gameMode").value) * 2;
  const playerInputs = document.querySelectorAll("#players input");
  players = Array.from(playerInputs).map(input => input.value.trim()).filter(name => name !== "");

  if (players.length !== totalPlayers) {
    alert(`Veuillez entrer ${totalPlayers} noms de joueurs.`);
    return;
  }

  players.sort(() => Math.random() - 0.5);
  const half = players.length / 2;
  team1 = players.slice(0, half);
  team2 = players.slice(half);

  displayTeams();
}

function displayTeams() {
  document.getElementById("team1Players").innerHTML = team1.map(name => `<p>${name}</p>`).join("");
  document.getElementById("team2Players").innerHTML = team2.map(name => `<p>${name}</p>`).join("");
}

function createPointButtons() {
  const maxPoints = gameMode === "1" ? 3 : 6;
  const team1Container = document.getElementById("team1Points");
  const team2Container = document.getElementById("team2Points");

  team1Container.innerHTML = "";
  team2Container.innerHTML = "";

  for (let i = 0; i <= maxPoints; i++) {
    const btn1 = document.createElement("button");
    btn1.textContent = i;
    btn1.addEventListener("click", () => selectPoint(btn1, 1));
    team1Container.appendChild(btn1);

    const btn2 = document.createElement("button");
    btn2.textContent = i;
    btn2.addEventListener("click", () => selectPoint(btn2, 2));
    team2Container.appendChild(btn2);
  }
}

function selectPoint(button, team) {
  const containerId = team === 1 ? "team1Points" : "team2Points";
  const buttons = document.querySelectorAll(`#${containerId} button`);
  buttons.forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");

  if (team === 1) {
    selectedPoints.team1 = parseInt(button.textContent);
  } else {
    selectedPoints.team2 = parseInt(button.textContent);
  }
}

function addScores() {
  const points1 = selectedPoints.team1 ?? 0;
  const points2 = selectedPoints.team2 ?? 0;

  // Règle : si une équipe marque, l'autre marque 0
  if (points1 > 0 && points2 === 0) {
    score1 += points1;
  } else if (points2 > 0 && points1 === 0) {
    score2 += points2;
  }

  saveRound(points1, points2);
  updateScores();
  resetPointSelection();
  checkWinner();
}

function saveRound(p1, p2) {
  const num = roundHistory.length + 1;
  roundHistory.push({ num, p1, p2 });
  const history = roundHistory.map(r => `Mène ${r.num} – Équipe 1 : ${r.p1}, Équipe 2 : ${r.p2}`).join("<br>");
  document.getElementById("rounds").innerHTML = history;
}

function resetPointSelection() {
  document.querySelectorAll(".points-grid button").forEach(btn => btn.classList.remove("selected"));
  selectedPoints.team1 = null;
  selectedPoints.team2 = null;
}

function updateScores() {
  document.getElementById("score1").textContent = score1;
  document.getElementById("score2").textContent = score2;
}

function checkWinner() {
  const winnerDiv = document.getElementById("winnerMessage");
  if (score1 >= 13) {
    winnerDiv.textContent = `Équipe 1 a gagné ! 🎉`;
    winnerDiv.classList.remove("hidden");
  } else if (score2 >= 13) {
    winnerDiv.textContent = `Équipe 2 a gagné ! 🎉`;
    winnerDiv.classList.remove("hidden");
  } else {
    winnerDiv.classList.add("hidden");
  }
}

function resetGame() {
  location.reload(); // Réinitialise complètement
}

function newMatch() {
  score1 = 0;
  score2 = 0;
  roundHistory = [];
  selectedPoints.team1 = null;
  selectedPoints.team2 = null;

  updateScores();
  resetPointSelection();
  document.getElementById("winnerMessage").classList.add("hidden");
  document.getElementById("rounds").innerHTML = "";
  createPointButtons();
}
