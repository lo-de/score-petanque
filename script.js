
let gameMode = 1;
let players = [];
let team1 = [];
let team2 = [];
let score1 = 0;
let score2 = 0;
let maxPoints = 13;
let roundHistory = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("gameMode").addEventListener("change", updatePlayerFields);
  updatePlayerFields();
});

function updatePlayerFields() {
  const mode = parseInt(document.getElementById("gameMode").value);
  const team1Div = document.getElementById("team1Inputs");
  const team2Div = document.getElementById("team2Inputs");
  team1Div.innerHTML = '<h3>Équipe 1</h3>';
  team2Div.innerHTML = '<h3>Équipe 2</h3>';

  for (let i = 0; i < mode; i++) {
    const input = document.createElement("input");
    input.placeholder = "Joueur " + (i + 1);
    input.id = "player" + i;
    team1Div.appendChild(input);
  }

  for (let i = 0; i < mode; i++) {
    const input = document.createElement("input");
    input.placeholder = "Joueur " + (i + 1 + mode);
    input.id = "player" + (i + mode);
    team2Div.appendChild(input);
  }
}

function shuffleTeams() {
  const mode = parseInt(document.getElementById("gameMode").value);
  const totalPlayers = mode * 2;
  const playerNames = [];

  for (let i = 0; i < totalPlayers; i++) {
    const input = document.getElementById("player" + i);
    if (input && input.value.trim() !== "") {
      playerNames.push(input.value.trim());
    }
  }

  if (playerNames.length !== totalPlayers) {
    alert("Veuillez remplir tous les noms de joueurs.");
    return;
  }

  // Mélanger les noms aléatoirement
  const shuffled = playerNames.sort(() => Math.random() - 0.5);
  team1 = shuffled.slice(0, mode);
  team2 = shuffled.slice(mode);

  // Mettre à jour les champs input avec les nouveaux noms
  for (let i = 0; i < totalPlayers; i++) {
    const input = document.getElementById("player" + i);
    input.value = i < mode ? team1[i] : team2[i - mode];
  }
}

function displayTeams() {
  const team1Elem = document.getElementById("team1Players");
  const team2Elem = document.getElementById("team2Players");
  team1Elem.innerHTML = '';
  team2Elem.innerHTML = '';
  team1.forEach(name => {
    const p = document.createElement("p");
    p.textContent = name;
    team1Elem.appendChild(p);
  });
  team2.forEach(name => {
    const p = document.createElement("p");
    p.textContent = name;
    team2Elem.appendChild(p);
  });
}

function startGame() {
  const mode = parseInt(document.getElementById("gameMode").value);
  const totalPlayers = mode * 2;
  players = [];
  for (let i = 0; i < totalPlayers; i++) {
    const name = document.getElementById("player" + i).value.trim() || `Joueur ${i+1}`;
    players.push(name);
  }
  team1 = players.slice(0, mode);
  team2 = players.slice(mode);
  displayTeams();
  score1 = 0;
  score2 = 0;
  roundHistory = [];
  updateScores();
  setupPointButtons();
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
}

function setupPointButtons() {
  const team1Points = document.getElementById("team1Points");
  const team2Points = document.getElementById("team2Points");
  team1Points.innerHTML = '';
  team2Points.innerHTML = '';
  const mode = parseInt(document.getElementById("gameMode").value);
  const maxSelectable = mode === 1 ? 3 : 6;
  for (let i = 0; i <= maxSelectable; i++) {
    const b1 = document.createElement("button");
    const b2 = document.createElement("button");
    b1.textContent = i;
    b2.textContent = i;
    b1.onclick = () => selectPoints("team1", i);
    b2.onclick = () => selectPoints("team2", i);
    team1Points.appendChild(b1);
    team2Points.appendChild(b2);
  }
}

function selectPoints(team, points) {
  const otherTeam = team === "team1" ? "team2" : "team1";
  const container = document.getElementById(team + "Points");
  const otherContainer = document.getElementById(otherTeam + "Points");
  Array.from(container.children).forEach(btn => {
    btn.classList.toggle("selected", btn.textContent == points);
  });
  Array.from(otherContainer.children).forEach(btn => {
    btn.classList.remove("selected");
  });
}

function getSelectedPoints(team) {
  const selected = document.querySelector("#" + team + "Points .selected");
  return selected ? parseInt(selected.textContent) : 0;
}

function addScores() {
  if (score1 >= maxPoints || score2 >= maxPoints) {
    return; // Ne rien faire si la partie est déjà terminée
  }

  const pts1 = getSelectedPoints("team1");
  const pts2 = getSelectedPoints("team2");

  if ((pts1 === 0 && pts2 === 0) || (pts1 > 0 && pts2 > 0)) {
    alert("Une seule équipe peut marquer des points par mène.");
    return;
  }

  score1 += pts1;
  score2 += pts2;

  roundHistory.push({team1: pts1, team2: pts2});
  updateScores();
  clearSelections();

  if (score1 >= maxPoints || score2 >= maxPoints) {
    const winnerText = score1 >= maxPoints
      ? `🎉 Équipe 1 (${team1.join(", ")}) gagne !`
      : `🎉 Équipe 2 (${team2.join(", ")}) gagne !`;

    document.getElementById("winnerMessage").textContent = winnerText;
    document.getElementById("winnerMessage").classList.remove("hidden");

    // Désactiver tous les boutons de points
    document.querySelectorAll(".points-grid button").forEach(btn => {
      btn.disabled = true;
    });

    // (Optionnel) Désactiver le bouton "Ajouter la mène"
    document.querySelector(".scoreboard button").disabled = true;
  }

  displayRounds();
}

function clearSelections() {
  document.querySelectorAll(".points-grid button").forEach(btn => {
    btn.classList.remove("selected");
  });
}

function displayRounds() {
  const rounds = document.getElementById("rounds");
  rounds.innerHTML = "<strong>Historique des mènes :</strong><br>";
  roundHistory.forEach((r, i) => {
    rounds.innerHTML += `Mène ${i + 1} : Équipe 1 (${r.team1}) - Équipe 2 (${r.team2})<br>`;
  });
}

function updateScores() {
  document.getElementById("score1").textContent = score1;
  document.getElementById("score2").textContent = score2;
}

function newMatch() {
  score1 = 0;
  score2 = 0;
  roundHistory = [];
  updateScores();
  clearSelections();
  document.getElementById("winnerMessage").classList.add("hidden");
  displayRounds();
  document.querySelectorAll(".points-grid button").forEach(btn => {
    btn.disabled = false;
  });
document.querySelector(".scoreboard button").disabled = false;
}

function resetGame() {
  document.getElementById("game").classList.add("hidden");
  document.getElementById("setup").classList.remove("hidden");
}
