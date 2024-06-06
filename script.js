document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spinButton'); // Spin-Button
    const resultDiv = document.getElementById('result'); // Ergebnisanzeige
    const scoreDiv = document.getElementById('score'); // Punktestand-Anzeige
    const reels = [
        document.getElementById('reel1'), // Erste Walze
        document.getElementById('reel2'), // Zweite Walze
        document.getElementById('reel3'), // Dritte Walze
        document.getElementById('reel4')  // Vierte Walze
    ];

    const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🔔']; // Mögliche Symbole
    let score = 0; // Startpunktestand

    // Soundeffekte
    const spinSound = new Audio('spin-sound.mp3'); // Spin-Sound
    const winSound = new Audio('win-sound.mp3'); // Gewinn-Sound

    const updateReelContent = () => {
        // Aktualisiere den Inhalt jeder Walze mit den Symbolen, mehrfach wiederholt
        reels.forEach(reel => {
            reel.innerHTML = `<div>${Array(10).fill(symbols).flat().map(symbol => `<div>${symbol}</div>`).join('')}</div>`;
        });
    };

    const spinReel = (reel, duration) => {
        const div = reel.querySelector('div');
        div.style.animation = `spin ${duration}s linear infinite`; // Dynamische Generierung der Animation mit individueller Dauer
    };

    const stopReel = (reel) => {
        const div = reel.querySelector('div');
        const computedStyle = window.getComputedStyle(div);
        const matrix = new WebKitCSSMatrix(computedStyle.transform);
        const translateY = matrix.m42; // Y-Translation aus der Transform-Matrix extrahieren
        div.style.animation = 'none';
        div.style.transform = `translateY(${translateY}px)`;
    };

    spinButton.addEventListener('click', () => {
        spinSound.play(); // Spielt den Spin-Sound ab

        // Aktualisiere den Inhalt der Walzen mit Symbolen
        updateReelContent();

        // Startet die Dreh-Animation für jede Walze mit individuellen Dauern
        reels.forEach((reel, index) => {
            const duration = Math.random() * 3 + 3; // Zufällige Dauer zwischen 3 und 6 Sekunden
            spinReel(reel, duration);
        });

        // Verzögerung für das Stoppen der Walzen nach 6 Sekunden
        setTimeout(() => {
            // Stoppe die Dreh-Animation für jede Walze
            reels.forEach(reel => {
                stopReel(reel);
            });

            // Zufällige Symbole für jede Walze generieren
            const results = reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]);

            // Zeige die endgültigen Symbole an
            showFinalResult(results);
        }, 6000); // Verzögerung für das Stoppen der Animation
    });

    const showFinalResult = (results) => {
        results.forEach((result, index) => {
            reels[index].innerHTML = `<div>${result}</div>`;
        });

        // Ergebnisprüfung nach dem Stoppen der Walzen
        const allSame = results.every(result => result === results[0]); // Prüfen, ob alle Symbole gleich sind
        const anyThreeSame = 
            (results[0] === results[1] && results[1] === results[2]) ||
            (results[1] === results[2] && results[2] === results[3]); // Prüfen, ob mindestens drei Symbole gleich sind

        if (allSame) {
            winSound.play(); // Spielt den Gewinn-Sound ab
            score += 100; // Erhöht die Punktzahl bei einem Gewinn
            resultDiv.textContent = 'Jackpot! Du hast gewonnen!';
        } else if (anyThreeSame) {
            winSound.play(); // Spielt den Gewinn-Sound ab
            score += 50; // Erhöht die Punktzahl bei drei gleichen Symbolen
            resultDiv.textContent = 'Du hast drei gleiche Symbole!';
        } else {
            resultDiv.textContent = 'Versuch es nochmal!';
        }
        scoreDiv.textContent = `Punktestand: ${score}`; // Aktualisiert die Punktestand-Anzeige
    };
});
