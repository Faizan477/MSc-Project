import { defineStore } from 'pinia'

export const useStudyTimerStore = defineStore('studyTimer',
    {
        state: () => {
            return {
                minutesSet:25,
                minutes: 25,
                seconds: 0,
                timerInterval: '',
                paused: false,
                running: false,
                startTime: 0,
                endTime: 0,
            }
        },
        actions: {
            startTimer() {
                if (this.paused == true) {
                    this.running = true
                    this.paused = false
                    this.endTime = Date.now() + this.millisecondsLeft
                    this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
                }
                else {
                    this.startTime = Date.now()
                    this.endTime = this.startTime + (this.minutesSet*60000)
                    this.running = true
                    this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
                }
            },
            updateTimer() {
                if (this.endTime - Date.now() <= 0) {
                    this.stopTimer()
                    //something about breaks and iterations 
                }
                else {
                    this.minutes = Math.trunc(((this.endTime - Date.now()) / 60000))
                    this.seconds = Math.trunc(((this.endTime - Date.now()) % 60000) / 1000)
                }
            },
            stopTimer() {
                this.running = false
                this.paused = false
                clearInterval(this.timerInterval)
                this.minutes = this.minutesSet
                this.seconds = 0
            },
            pauseTimer() {
                this.running = false
                this.paused = true
                clearInterval(this.timerInterval)
            },
            resetTimer() {
                this.stopTimer()
            },
        },
        getters:
        {
            millisecondsLeft: (state) => ((state.minutes * 60) + (state.seconds)) * 1000,
            millisecondsGone: (state) => (state.minutesSet*60000 - state.millisecondsLeft),
            percentageProgress: (state) => (state.millisecondsGone / (state.minutesSet*60000)) * 100
        }
    })