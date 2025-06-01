    let mode = 1;
    let team1 = [];
    let team2 = [];
    let total1 = 0;
    let total2 = 0;
    let history = [];
    let selectedScore1 = 0;
    let selectedScore2 = 0;

    document.getElementById("gameMode").addEventListener("change", (e) => {
      mode = parseInt(e.target.value);
      renderPlayerInputs();
    });

    function renderPlayerInputs() {
      const container = document.getElementById("players");
      container.innerHTML = "<h2>Entrez les noms des joueurs</h2>";
      for (let i = 0; i < mode; i++) {
        container.innerHTML += `<input type="text" placeholder="Equipe 1 - Joueur ${i + 1}" id="t1p${i}" />`;
      }
      for (let i = 0; i < mode; i++) {
        container.innerHTML += `<input type="text" placeholder="Equipe 2 - Joueur ${i + 1}" id="t2p${i}" />`;
      }
    }

    function shuffleTeams() {
      const totalPlayers = mode * 2;
      const allPlayers = [];
      for (let i = 0; i < mode; i++) {
        allPlayers.push(document.getElementById(`t1p${i}`).value || `Joueur ${i + 1}`);
        allPlayers.push(document.getElementById(`t2p${i}`).value || `Joueur ${i + 1 + mode}`);
      }
      for (let i = allPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPlayers[i], allPlayers[j]] = [allPlayers[j], allPlayers[i]];
      }
      for (let i = 0; i < mode; i++) {
        document.getElementById(`t1p${i}`).value = allPlayers[i];
        document.getElementById(`t2p${i}`).value = allPlayers[i + mode];
      }
    }

    function renderPointBoxes() {
      const maxPoints = (mode === 1) ? 3 : 6;
      const container1 = document.getElementById("team1Points");
      const container2 = document.getElementById("team2Points");
      container1.innerHTML = "";
      container2.innerHTML = "";
      for (let i = 0; i <= maxPoints; i++) {
        const box1 = document.createElement("div");
        const box2 = document.createElement("div");
        box1.className = "point-box";
        box1.textContent = i;
        box1.onclick = () => {
          selectedScore1 = i;
          selectedScore2 = 0;
          updateSelectedBoxes(container1, i);
          updateSelectedBoxes(container2, 0);
        };
        box2.className = "point-box";
        box2.textContent = i;
        box2.onclick = () => {
          selectedScore2 = i;
          selectedScore1 = 0;
          updateSelectedBoxes(container2, i);
          updateSelectedBoxes(container1, 0);
        };
        container1.appendChild(box1);
        container2.appendChild(box2);
      }
    }

    function updateSelectedBoxes(container, value) {
      [...container.children].forEach(box => {
        box.classList.toggle("selected", parseInt(box.textContent) === value);
      });
    }

    function startGame() {
      team1 = [];
      team2 = [];
      for (let i = 0; i < mode; i++) {
        team1.push(document.getElementById(`t1p${i}`).value || `Joueur ${i + 1}`);
        team2.push(document.getElementById(`t2p${i}`).value || `Joueur ${i + 1}`);
      }
      total1 = 0;
      total2 = 0;
      history = [];
      selectedScore1 = 0;
      selectedScore2 = 0;
      document.getElementById("setup").classList.add("hidden");
      document.getElementById("game").classList.remove("hidden");
      document.getElementById("teamNames").innerHTML = `
        <span class="team1">Équipe 1: ${team1.join(", ")}</span><br>
        <span class="team2">Équipe 2: ${team2.join(", ")}</span>
      `;
      document.getElementById("score1").textContent = `0`;
      document.getElementById("score2").textContent = `0`;
      document.getElementById("rounds").innerHTML = "";
      document.getElementById("winnerMessage").classList.add("hidden");
      document.getElementById("statistics").classList.add("hidden");
      renderPointBoxes();
    }

    function addScores() {
      if (total1 >= 13 || total2 >= 13) return;

      total1 += selectedScore1;
      total2 += selectedScore2;
      history.push(`Mène ${history.length + 1}: ${selectedScore1} - ${selectedScore2}`);
      document.getElementById("score1").textContent = total1;
      document.getElementById("score2").textContent = total2;
      document.getElementById("rounds").innerHTML = history.join("<br>");
      selectedScore1 = 0;
      selectedScore2 = 0;
      renderPointBoxes();

      if (total1 >= 13 || total2 >= 13) {
        const winnerNames = (total1 >= 13) ? team1 : team2;
        document.getElementById("winnerMessage").textContent = `Victoire de : ${winnerNames.join(", ")}`;
        document.getElementById("winnerMessage").classList.remove("hidden");
        showStatistics();
      }
    }

    function showStatistics() {
      const totalRounds = history.length;
      const avg1 = (total1 / totalRounds).toFixed(2);
      const avg2 = (total2 / totalRounds).toFixed(2);
      document.getElementById("statistics").innerHTML =
        `Nombre de mènes : ${totalRounds}<br>` +
        `Moyenne points Équipe 1 : ${avg1}<br>` +
        `Moyenne points Équipe 2 : ${avg2}`;
      document.getElementById("statistics").classList.remove("hidden");
    }

    function resetGame() {
      document.getElementById("setup").classList.remove("hidden");
      document.getElementById("game").classList.add("hidden");
      document.getElementById("players").innerHTML = "";
      document.getElementById("teamNames").innerHTML = "";
      document.getElementById("score1").textContent = "0";
      document.getElementById("score2").textContent = "0";
      document.getElementById("rounds").innerHTML = "";
      document.getElementById("winnerMessage").classList.add("hidden");
      document.getElementById("statistics").classList.add("hidden");
      renderPlayerInputs();
    }

    renderPlayerInputs();
