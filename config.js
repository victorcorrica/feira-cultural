/*
 * Pop Art Memory settings
 * Edit this file to change the game's words, artwork, audio and texts.
 */
window.GAME_CONFIG = {
    cardBack: "./assets/cards/capa.png",
    sounds: {
        correct: "./assets/audio/acerto.wav",
        wrong: "./assets/audio/erro.wav"
    },
    mainBackground: "",
    mismatchDelay: 950,
    theme: {
        ink: "#17212b",
        paper: "#fff9ef",
        red: "#f0443e",
        yellow: "#ffd44d",
        blue: "#3c9dca"
    },
    texts: {
        brandKicker: "Feira Cultural",
        brandName: "Jogo da Memória",
        topbarNote: "Inglês × Artes",
        eyebrow: "Pop Art × Libras",
        title: "Encontre os pares",
        subtitle: "Pop Art, Libras e palavras em inglês.",
        instructions: "Encontre as duas cartas que formam o mesmo par.",
        pairs: "Pares encontrados",
        attempts: "Tentativas",
        restart: "Reiniciar jogo",
        ready: "Escolha uma carta para começar.",
        oneCard: "Agora encontre o par.",
        mismatch: "Wrong!",
        match: "Par encontrado!",
        completionEyebrow: "Muito bem",
        congratulations: "Congratulations!",
        finalMessage: "Parabéns! Você encontrou todos os pares.",
        playAgain: "Jogar novamente",
        footerLead: "Observe com atenção.",
        footerText: "Cada palavra tem um sinal.",
        credit: "© Victor Corrisa"
    },
    pairs: [
        { id: 1, name: "Coffee", word: "COFFEE", sign: "CAFÉ", cards: ["./assets/cards/par1_1.png", "./assets/cards/par1_2.png"], color: "#f0443e", accent: "#ffd44d", symbol: "☕" },
        { id: 2, name: "Pancake", word: "PANCAKE", sign: "PANQUECA", cards: ["./assets/cards/par2_1.png", "./assets/cards/par2_2.png"], color: "#ff6b8a", accent: "#ffd44d", symbol: "●" },
        { id: 3, name: "Toast", word: "TOAST", sign: "TORRADA", cards: ["./assets/cards/par3_1.png", "./assets/cards/par3_2.png"], color: "#3c9dca", accent: "#e8f4e8", symbol: "▣" },
        { id: 4, name: "Milk", word: "MILK", sign: "LEITE", cards: ["./assets/cards/par4_1.png", "./assets/cards/par4_2.png"], color: "#8264c7", accent: "#ffd44d", symbol: "◇" },
        { id: 5, name: "Toaster", word: "TOASTER", sign: "TORRADEIRA", cards: ["./assets/cards/par5_1.png", "./assets/cards/par5_2.png"], color: "#17a486", accent: "#fff9ef", symbol: "▤" },
        { id: 6, name: "Bacon", word: "BACON", sign: "BACON", cards: ["./assets/cards/par6_1.png", "./assets/cards/par6_2.png"], color: "#f28b30", accent: "#fff9ef", symbol: "≈" }
    ]
};