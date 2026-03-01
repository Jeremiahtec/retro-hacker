 const vocabulary = [
            'bypass-firewall', 'encrypt-payload', 'frontend-render', 
            'fetch-api', 'virtulease-db', 'override-telemetry', 
            'inject-script', 'sudo-rm-rf', 'compile-assets', 
            'route-traffic', 'deploy-server', 'null-pointer'
        ];

        const gameBoard = document.getElementById('game-board');
        const inputField = document.getElementById('type-input');
        const scoreDisplay = document.getElementById('score');
        const statusDisplay = document.getElementById('status');
        const gameOverScreen = document.getElementById('game-over-screen');

        let activeWords = [];
        let score = 0;
        let gameInterval;
        let spawnInterval;
        let isGameOver = false;

        let fallSpeed = 2;
        let spawnRate = 2000;

        function spawnWord() {
            if (isGameOver) return;

            const wordText = vocabulary[Math.floor(Math.random() * vocabulary.length)];
            const wordEl = document.createElement('div');
            wordEl.classList.add('falling-word');
            wordEl.textContent = wordText;

            const maxLeft = gameBoard.clientWidth - 200; 
            const randomLeft = Math.floor(Math.random() * maxLeft);
            
            wordEl.style.left = `${randomLeft}px`;
            wordEl.style.top = '-30px';

            gameBoard.appendChild(wordEl);
            
            activeWords.push({
                element: wordEl,
                text: wordText,
                top: -30
            });
        }

        function updateGame() {
            if (isGameOver) return;

            const boardHeight = gameBoard.clientHeight;

            for (let i = activeWords.length - 1; i >= 0; i--) {
                let wordObj = activeWords[i];
                wordObj.top += fallSpeed;
                wordObj.element.style.top = `${wordObj.top}px`;

                if (wordObj.top >= boardHeight - 30) {
                    endGame();
                }
            }
        }

        function endGame() {
            isGameOver = true;
            clearInterval(gameInterval);
            clearInterval(spawnInterval);
            inputField.disabled = true;
            statusDisplay.textContent = "COMPROMISED";
            statusDisplay.style.color = "red";
            gameOverScreen.style.display = "block";
            
            activeWords.forEach(w => w.element.style.color = "red");
        }

        inputField.addEventListener('input', (e) => {
            if (isGameOver) return;

            const typedText = e.target.value.trim();
            const matchIndex = activeWords.findIndex(w => w.text === typedText);

            if (matchIndex > -1) {
                gameBoard.removeChild(activeWords[matchIndex].element);
                activeWords.splice(matchIndex, 1);
                
                score++;
                scoreDisplay.textContent = score;
                inputField.value = '';

                if (score % 5 === 0) {
                    fallSpeed += 0.5;
                }
            }
        });

        document.addEventListener('click', () => {
            if(!isGameOver) inputField.focus();
        });

        function init() {
            spawnWord();
            gameInterval = setInterval(updateGame, 50);
            spawnInterval = setInterval(spawnWord, spawnRate);
        }

        init();