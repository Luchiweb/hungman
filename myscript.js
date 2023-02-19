const bodyWord = document.getElementById("word");
const input = document.getElementById("input");
const form = document.getElementsByClassName("pole-vvoda");
// КНОПКИ
const btnSubmit = document.getElementById("btn-submit");
const btnRestart = document.getElementById("btn-restart");
const guesWords = [
    "любовь",
    "картошка",
    "цемент",
    "бабушка",
    "пельмень",
    "олень",
    "рафтинг",
    "соль",
    "кипарис",
    "улов",
    "закал",
    "метафора",
];
class Game {
    // Singleton
    static getInstance() {
        if (Game.instance === null) {
            Game.instance = new Game(guesWords);
        }
        return Game.instance;
    }
    constructor(words) {
        // Settings
        this.DEFAULT_INPUT_COLOR = "#6e97be";
        this.ERROR_INPUT_COLOR = "red";
        this.DEFAULT_LIFES_COUNT = 10;
        this.DELAY = 500;
        this.words = words;
        this.guy = document.querySelectorAll(".part");
        this.startNewGame();
    }
    startNewGame() {
        this.cleanInput();
        this.resetGuy();
        this.lifes = this.DEFAULT_LIFES_COUNT;
        this.word = this.chooseWord();
        const wordLength = this.word.length;
        this.remainingLetters = wordLength;
        this.answerArray = new Array(wordLength).fill("_");
        this.showFoundLetters();
    }
    chooseWord() {
        const randomNumber = Math.floor(Math.random() * this.words.length);
        const newWord = this.words[randomNumber];
        return newWord;
    }
    checkInsertedLetter() {
        const currentLetter = this.getCurrentLetter();
        const isValidaLetter = this.isUniqueLetter(currentLetter);
        if (isValidaLetter) {
            const amountOfAddedLetters = this.addLetter(currentLetter);
            this.remainingLetters -= amountOfAddedLetters;
            if (this.remainingLetters === 0)
                this.initWin();
        }
        else {
            const remainingLifes = --this.lifes;
            this.cleanInput();
            this.indicateWrongAnswer();
            this.guy[remainingLifes].style.display = "block";
            if (remainingLifes === 0)
                this.initLose();
        }
        this.cleanInput();
    }
    getCurrentLetter() {
        const currentLetter = input.value;
        if (currentLetter.length !== 1) {
            alert("Пожалуйста, введите одиночную букву");
            input.value = "";
        }
        return currentLetter.toLowerCase();
    }
    isUniqueLetter(currentLetter) {
        const isLetterInWord = this.word.includes(currentLetter);
        const isLetterAlreadyFinded = this.answerArray.includes(currentLetter);
        return isLetterInWord && !isLetterAlreadyFinded;
    }
    insertLetterToAnswer(letter) {
        const replacedSymbols = this.answerArray.reduce((prevValue, symbol, index) => {
            if (symbol == "_" && letter === this.word[index]) {
                this.answerArray[index] = letter;
                return ++prevValue;
            }
            return prevValue;
        }, 0);
        return replacedSymbols;
    }
    addLetter(currentLetter) {
        const amountOfAddedLetters = this.insertLetterToAnswer(currentLetter);
        this.showFoundLetters();
        return amountOfAddedLetters;
    }
    showFoundLetters() {
        bodyWord.innerText = this.answerArray.join(" ");
    }
    indicateWrongAnswer() {
        input.style.borderColor = this.ERROR_INPUT_COLOR;
        setTimeout(() => {
            input.style.borderColor = this.DEFAULT_INPUT_COLOR;
        }, this.DELAY);
    }
    cleanInput() {
        input.value = "";
        input.focus();
    }
    initWin() {
        setTimeout(() => {
            alert(`Поздравляю! Вы угадали слово ${this.word}`);
            this.startNewGame();
        }, this.DELAY);
    }
    initLose() {
        setTimeout(() => {
            alert(`Игра окончена, было загадано слово ${this.word}`);
            this.startNewGame();
        }, this.DELAY);
    }
    resetGuy() {
        for (const part of this.guy)
            part.style.display = "none";
    }
}
Game.instance = null;
const game = Game.getInstance();
btnRestart.addEventListener("click", game.startNewGame.bind(game));
btnSubmit.addEventListener("click", game.checkInsertedLetter.bind(game));
input.addEventListener("keyup", (event) => {
    if (event.code === "Enter")
        game.checkInsertedLetter();
});
