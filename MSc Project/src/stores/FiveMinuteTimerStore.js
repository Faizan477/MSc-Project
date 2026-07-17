import { defineStore } from 'pinia'
import { useStudyTimerStore } from './StudyTimerStore.js'
export const useFiveMinuteTimerStore = defineStore('fiveMinuteTimer',
    {
        state: () => {
            return {
                minutes: 5,
                seconds: 0,
                timerInterval: '',
                fiveMinutePaused: false,
                fiveMinuteRunning: false,
                startTime: 0,
                endTime: 0,
                prompt: false,
            }
        },
        actions: {
            otherTimerRunning() {
                const studyTimerStore = useStudyTimerStore()
                return studyTimerStore.running
            },
            startTimer() {
                if (this.otherTimerRunning()) {
                    alert("Another timer is currently running. Please reset the existing timer to continue")
                }
                else {
                    if (this.fiveMinutePaused == true) {
                        this.fiveMinuteRunning = true
                        this.fiveMinutePaused = false
                        this.endTime = Date.now() + this.millisecondsLeft
                        this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
                    }
                    else {
                        this.startTime = Date.now()
                        this.endTime = this.startTime + 300000
                        this.fiveMinuteRunning = true
                        this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
                    }
                }
            },
            updateTimer() {
                if (this.endTime - Date.now() <= 0) {
                    this.stopTimer()
                    this.showPrompt()
                }
                else {
                    this.minutes = Math.trunc(((this.endTime - Date.now()) / 60000))
                    this.seconds = Math.trunc(((this.endTime - Date.now()) % 60000) / 1000)
                }
            },
            stopTimer() {
                this.fiveMinuteRunning = false
                this.fiveMinutePaused = false
                clearInterval(this.timerInterval)
                this.minutes = 5
                this.seconds = 0
            },
            pauseTimer() {
                this.fiveMinuteRunning = false
                this.fiveMinutePaused = true
                clearInterval(this.timerInterval)
            },
            resetTimer() {
                this.stopTimer()
            },
            showPrompt() {
                this.prompt = true
            },
            removePrompt() {
                this.prompt = false
            },
        },
        getters:
        {
            millisecondsLeft: (state) => ((state.minutes * 60) + (state.seconds)) * 1000,
            millisecondsGone: (state) => ((300000 - state.millisecondsLeft)),
            percentageProgress: (state) => (state.millisecondsGone / 300000) * 100
        }
    })