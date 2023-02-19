const bodyWord = document.getElementById("word");
const input = document.getElementById("input") as HTMLInputElement;
const form = document.getElementsByClassName("pole-vvoda");

// КНОПКИ
const btnSubmit = document.getElementById("btn-submit");
const btnRestart = document.getElementById("btn-restart");

const guesWords: string[] = [
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
  private guy: HTMLElement[];
  private words: string[];

  // Current game state
  private word!: string;
  private remainingLetters!: number;
  private lifes!: number;
  private answerArray!: string[];

  // Settings
  private DEFAULT_INPUT_COLOR = "#6e97be";
  private ERROR_INPUT_COLOR = "red";
  private DEFAULT_LIFES_COUNT = 10;
  private DELAY = 500;

  private static instance: Game | null = null;

  // Singleton
  public static getInstance() {
    if (Game.instance === null) {
      Game.instance = new Game(guesWords);
    }

    return Game.instance;
  }

  private constructor(words: string[]) {
    this.words = words;
    this.guy = document.querySelectorAll(".part") as unknown as HTMLElement[];
    this.startNewGame();
  }

  public startNewGame() {
    this.cleanInput();
    this.resetGuy();
    this.lifes = this.DEFAULT_LIFES_COUNT;

    this.word = this.chooseWord();

    const wordLength: number = this.word.length;
    this.remainingLetters = wordLength;
    this.answerArray = new Array(wordLength).fill("_");

    this.showFoundLetters();
  }

  private chooseWord(): string {
    const randomNumber: number = Math.floor(Math.random() * this.words.length);
    const newWord: string = this.words[randomNumber];

    return newWord;
  }

  public checkInsertedLetter() {
    const currentLetter: string = this.getCurrentLetter();
    const isValidaLetter: boolean = this.isUniqueLetter(currentLetter);

    if (isValidaLetter) {
      const amountOfAddedLetters: number = this.addLetter(currentLetter);

      this.remainingLetters -= amountOfAddedLetters;
      if (this.remainingLetters === 0) this.initWin();
    } else {
      const remainingLifes = --this.lifes;

      this.cleanInput();
      this.indicateWrongAnswer();

      this.guy[remainingLifes].style.display = "block";

      if (remainingLifes === 0) this.initLose();
    }

    this.cleanInput();
  }

  private getCurrentLetter() {
    const currentLetter: string = input.value;

    if (currentLetter.length !== 1) {
      alert("Пожалуйста, введите одиночную букву");
      input.value = "";
    }

    return currentLetter.toLowerCase();
  }

  private isUniqueLetter(currentLetter: string) {
    const isLetterInWord: boolean = this.word.includes(currentLetter);
    const isLetterAlreadyFinded: boolean =
      this.answerArray.includes(currentLetter);

    return isLetterInWord && !isLetterAlreadyFinded;
  }

  private insertLetterToAnswer(letter: string) {
    const replacedSymbols: number = this.answerArray.reduce(
      (prevValue: number, symbol: string, index: number) => {
        if (symbol == "_" && letter === this.word[index]) {
          this.answerArray[index] = letter;
          return ++prevValue;
        }

        return prevValue;
      },
      0
    );

    return replacedSymbols;
  }

  private addLetter(currentLetter: string) {
    const amountOfAddedLetters: number =
      this.insertLetterToAnswer(currentLetter);
    this.showFoundLetters();

    return amountOfAddedLetters;
  }

  private showFoundLetters() {
    bodyWord!.innerText = this.answerArray.join(" ");
  }

  private indicateWrongAnswer() {
    input.style.borderColor = this.ERROR_INPUT_COLOR;

    setTimeout(() => {
      input.style.borderColor = this.DEFAULT_INPUT_COLOR;
    }, this.DELAY);
  }

  private cleanInput() {
    input.value = "";
    input.focus();
  }

  private initWin() {
    setTimeout(() => {
      alert(`Поздравляю! Вы угадали слово ${this.word}`);
      this.startNewGame();
    }, this.DELAY);
  }

  private initLose() {
    setTimeout(() => {
      alert(`Игра окончена, было загадано слово ${this.word}`);
      this.startNewGame();
    }, this.DELAY);
  }

  private resetGuy() {
    for (const part of this.guy) part.style.display = "none";
  }
}

const game = Game.getInstance();

btnRestart!.addEventListener("click", game.startNewGame.bind(game));
btnSubmit!.addEventListener("click", game.checkInsertedLetter.bind(game));
input.addEventListener("keyup", (event) => {
  if (event.code === "Enter") game.checkInsertedLetter();
});
