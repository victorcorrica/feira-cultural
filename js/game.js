(function () {
    "use strict";

    const sourceConfig = window.GAME_CONFIG || {};
    const config = {
        ...sourceConfig,
        pairs: Array.isArray(sourceConfig.pairs) ? sourceConfig.pairs.filter((pair) => pair && pair.id) : []
    };
    const board = document.querySelector("#board");
    const matchesElement = document.querySelector("#matches");
    const totalPairsElement = document.querySelector("#total-pairs");
    const movesElement = document.querySelector("#moves");
    const progressBar = document.querySelector("#progress-bar");
    const statusMessage = document.querySelector("#status-message");
    const modal = document.querySelector("#completion-modal");
    const restartButtons = document.querySelectorAll("#restart-button, #play-again-button");

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matches = 0;
    let moves = 0;
    let mismatchTimer = null;
    let previousLayout = "";

    function shuffle(cards) {
        const shuffled = [...cards];
        for (let index = shuffled.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
        }
        return shuffled;
    }

    function createCard(pair, imagePath) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "card";
        card.dataset.pairId = pair.id;
        card.setAttribute("aria-label", "Carta fechada");
        card.innerHTML = `
            <span class="card-inner">
                <span class="card-face card-front ${imagePath ? "has-image" : ""}" style="--card-color: ${pair.color || "#f0443e"}">
                    <img class="card-image" src="${imagePath || ""}" alt="" aria-hidden="true">
                    <span class="card-symbol" style="color: ${pair.accent || "#ffd44d"}">${pair.symbol || "✦"}</span>
                    <span class="card-word">${pair.word || "WORD"}</span>
                    <span class="card-sign">${pair.sign || "Libras"}</span>
                </span>
                <span class="card-face card-back" aria-hidden="true">
                    <img class="card-back-image" src="${config.cardBack || ""}" alt="">
                </span>
            </span>`;

        const image = card.querySelector(".card-image");
        if (!imagePath) image.remove();
        else image.addEventListener("error", () => image.remove(), { once: true });
        const backImage = card.querySelector(".card-back-image");
        if (!config.cardBack) backImage.remove();
        else backImage.addEventListener("error", () => backImage.remove(), { once: true });
        card.addEventListener("click", () => handleCardClick(card));
        return card;
    }

    function handleCardClick(card) {
        if (lockBoard || card === firstCard || card.classList.contains("is-matched")) return;
        card.classList.add("is-flipped");
        card.setAttribute("aria-label", `Carta ${card.dataset.word || ""}, ${card.dataset.sign || "sinal em Libras"}`);

        if (!firstCard) {
            firstCard = card;
            statusMessage.textContent = config.texts?.oneCard || "Agora encontre o par.";
            return;
        }

        secondCard = card;
        moves += 1;
        movesElement.textContent = moves;
        lockBoard = true;
        const isMatch = firstCard.dataset.pairId === secondCard.dataset.pairId;
        if (isMatch) handleMatch();
        else handleMismatch();
    }

    function handleMatch() {
        firstCard.classList.add("is-matched");
        secondCard.classList.add("is-matched");
        matches += 1;
        matchesElement.textContent = matches;
        progressBar.style.width = `${(matches / config.pairs.length) * 100}%`;
        statusMessage.textContent = config.texts?.match || "Par encontrado!";
        playSound(config.sounds?.correct);
        resetTurn();
        if (matches === config.pairs.length) showCompletion();
    }

    function handleMismatch() {
        statusMessage.textContent = config.texts?.mismatch || "Wrong!";
        playSound(config.sounds?.wrong);
        mismatchTimer = window.setTimeout(() => {
            firstCard.classList.remove("is-flipped");
            secondCard.classList.remove("is-flipped");
            resetTurn();
            statusMessage.textContent = config.texts?.ready || "Escolha uma carta para começar.";
        }, Number(config.mismatchDelay) || 950);
    }

    function resetTurn() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    function playSound(source) {
        if (!source) {
            playFallbackTone();
            return;
        }
        const audio = new Audio(source);
        audio.play().catch(playFallbackTone);
    }

    function playFallbackTone() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.frequency.value = 440;
        gain.gain.setValueAtTime(.08, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .16);
        oscillator.start();
        oscillator.stop(context.currentTime + .16);
    }

    function showCompletion() {
        document.querySelector("#completion-eyebrow").textContent = config.texts?.completionEyebrow || "Muito bem";
        document.querySelector("#completion-title").textContent = config.texts?.congratulations || "Congratulations!";
        document.querySelector("#completion-copy").textContent = config.texts?.finalMessage || "Parabéns! Você encontrou todos os pares.";
        window.setTimeout(() => {
            modal.hidden = false;
            document.querySelector("#play-again-button").focus();
        }, 350);
    }

    function setupGame() {
        window.clearTimeout(mismatchTimer);
        modal.hidden = true;
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        matches = 0;
        moves = 0;
        matchesElement.textContent = "0";
        movesElement.textContent = "0";
        totalPairsElement.textContent = config.pairs.length;
        progressBar.style.width = "0%";
        statusMessage.textContent = config.texts?.ready || "Escolha uma carta para começar.";
        board.replaceChildren();
        const cards = config.pairs.flatMap((pair) => (Array.isArray(pair.cards) ? pair.cards.slice(0, 2) : []).map((imagePath) => ({ pair, imagePath })));
        let shuffledCards = shuffle(cards);
        let layoutKey = shuffledCards.map(({ pair, imagePath }) => `${pair.id}:${imagePath}`).join("|");
        while (shuffledCards.length > 1 && layoutKey === previousLayout) {
            shuffledCards = shuffle(cards);
            layoutKey = shuffledCards.map(({ pair, imagePath }) => `${pair.id}:${imagePath}`).join("|");
        }
        previousLayout = layoutKey;
        shuffledCards.forEach(({ pair, imagePath }) => {
            const card = createCard(pair, imagePath);
            card.dataset.word = pair.word || "palavra";
            card.dataset.sign = pair.sign || "sinal em Libras";
            board.appendChild(card);
        });
    }

    const texts = config.texts || {};
    document.querySelector("#brand-kicker").textContent = texts.brandKicker || "Feira Cultural";
    document.querySelector("#brand-name").textContent = texts.brandName || "Jogo da Memória";
    document.querySelector("#topbar-note").textContent = texts.topbarNote || "Inglês × Artes";
    document.querySelector("#game-eyebrow").textContent = texts.eyebrow || "Pop Art × Libras";
    document.querySelector("#game-title").textContent = texts.title || "Encontre os pares";
    document.querySelector("#game-subtitle").textContent = texts.subtitle || "Combine as palavras em inglês.";
    document.querySelector("#game-instructions").textContent = texts.instructions || "Encontre as duas cartas que formam o mesmo par.";
    document.querySelector("#pairs-label").textContent = texts.pairs || "Pares encontrados";
    document.querySelector("#attempts-label").textContent = texts.attempts || "Tentativas";
    document.querySelector("#restart-label").textContent = texts.restart || "Reiniciar jogo";
    document.querySelector("#footer-lead").textContent = texts.footerLead || "Observe com atenção.";
    document.querySelector("#footer-text").textContent = texts.footerText || "Cada palavra tem um sinal.";
    document.querySelector("#credit").textContent = texts.credit || "© Victor Corrisa";
    document.querySelector("#play-again-label").textContent = texts.playAgain || "Jogar novamente";
    document.title = texts.title || "Jogo da Memória";
    document.documentElement.style.setProperty("--ink", config.theme?.ink || "#17212b");
    document.documentElement.style.setProperty("--paper", config.theme?.paper || "#fff9ef");
    document.documentElement.style.setProperty("--red", config.theme?.red || "#f0443e");
    document.documentElement.style.setProperty("--yellow", config.theme?.yellow || "#ffd44d");
    document.documentElement.style.setProperty("--blue", config.theme?.blue || "#3c9dca");
    if (config.mainBackground) document.body.style.backgroundImage = `url("${config.mainBackground}")`;
    restartButtons.forEach((button) => button.addEventListener("click", setupGame));
    setupGame();
})();