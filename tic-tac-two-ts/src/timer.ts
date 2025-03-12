import {GameBrain} from "./game.ts";

export class Timer {
  private timerInterval: number | null;
  private timerRunning: boolean;
  private elapsedTime: number;
  
  constructor() {
    this.timerInterval = null;
    this.timerRunning = false;
    this.elapsedTime = 0;
  }

  createTimer(game: GameBrain): HTMLElement{
    let timer = document.querySelector('.timer-container');
    if (timer) {
      return timer as HTMLElement;
    }

    let timerContainer = document.createElement('div');
    timerContainer.classList.add('timer-container');

    let timerDisplay = document.createElement('div');
    timerDisplay.classList.add('timer-display');
    timerDisplay.innerHTML = `Time: 0s`;
    timerContainer.appendChild(timerDisplay);


    let timerButton = document.createElement('button');
    timerButton.classList.add('timer-button');
    timerButton.innerHTML = 'Start Timer';
    timerButton.addEventListener('click', () => this.toggleTimer(game));

    timerContainer.appendChild(timerButton);
    return timerContainer;
  }

  toggleTimer(game: GameBrain): void {
    let timerButton = document.querySelector('.timer-button') as HTMLButtonElement;
    let timerDisplay = document.querySelector('.timer-display') as HTMLElement;


    if (this.timerRunning) {
      clearInterval(this.timerInterval!);
      timerButton.innerHTML = 'Start Timer';
      game.gameState = 'Stopped';
      this.timerRunning = false;
    } else {
      game.gameState = 'Playing';
      this.timerInterval = setInterval(() => {
        this.elapsedTime++;
        timerDisplay.innerHTML = `Time: ${this.elapsedTime}s`;
      }, 1000);
      timerButton.innerHTML = 'Stop Timer';
      this.timerRunning = true;
    }

    console.log(this.timerRunning);


  }

  resetTimer(): void {
    clearInterval(this.timerInterval!);
    this.timerInterval = null;
    this.elapsedTime = 0;
    this.timerRunning = false;

    let timerDisplay = document.querySelector('.timer-display');
    let timerButton = document.querySelector('.timer-button');

    if (timerDisplay) timerDisplay.innerHTML = `Time: 0s`;
    if (timerButton) timerButton.innerHTML = 'Start Timer';
  }

  stopTimer(): void {
    clearInterval(this.timerInterval!);
    this.timerRunning = false;
  }


}
