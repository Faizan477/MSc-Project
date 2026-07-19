import { defineStore } from 'pinia'
import { Howl, Howler } from 'howler'
import { useFiveMinuteTimerStore } from './FiveMinuteTimerStore'
import timer1 from '../assets/timerAlarmSounds/timer1.mp3'
import timer2 from '../assets/timerAlarmSounds/timer2.mp3'
import timer3 from '../assets/timerAlarmSounds/timer3.mp3'
export const useStudyTimerStore = defineStore('studyTimer',
    {
        state: () => {
            return {
                minutesSet: 25,
                shortBreakMinutesSet: 5,
                longBreakMinutesSet: 15,
                numSessionsSet: 6,
                minutes: 25,
                seconds: 0,
                timerInterval: '',
                paused: false,
                running: false,
                startTime: 0,
                endTime: 0,
                currentSession: 1,
                currentShortBreak: 1,
                currentLongBreak: 1,
                shortBreak: false,
                longBreak: false,
                timerAlarmSound: 'timer1'
            }
        },
        actions: {
            otherTimerRunning() {
                const fiveMinuteStore = useFiveMinuteTimerStore()
                console.log("The timer is" + fiveMinuteStore.fiveMinuteRunning)
                return fiveMinuteStore.fiveMinuteRunning
            },
            startPomodoroTimer() {
                if (this.otherTimerRunning()) {
                    alert("Another timer is currently running. Please reset the existing timer to continue")
                }
                else {
                    this.startTimer()
                }
            },
            startTimer() {
                if (this.paused == true) {
                    this.running = true
                    this.paused = false
                    this.endTime = Date.now() + this.millisecondsLeft
                    this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
                }
                else {
                    if (this.longBreak == true) {
                        this.startTime = Date.now()
                        this.endTime = this.startTime + (this.longBreakMinutesSet * 60000)
                        this.running = true
                        this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
                    }
                    else if (this.shortBreak == true) {
                        this.startTime = Date.now()
                        this.endTime = this.startTime + (this.shortBreakMinutesSet * 60000)
                        this.running = true
                        this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
                    }
                    else {
                        this.startTime = Date.now()
                        this.endTime = this.startTime + (this.minutesSet * 60000)
                        this.running = true
                        this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
                    }
                }
            },
            updateTimer() {
                if (this.endTime - Date.now() <= 0) {
                    this.stopTimer()
                    if (this.timerAlarmSound == 'timer1') {
                        let sound = new Howl({ src: [timer1] })
                        sound.play()
                    }
                    else if (this.timerAlarmSound == 'timer2') {
                        let sound = new Howl({ src: [timer2] })
                        sound.play()
                    }
                    else if (this.timerAlarmSound == 'timer3') {
                        let sound = new Howl({ src: [timer3] })
                        sound.play()
                    }
                    if (this.shortBreak == true || this.longBreak == true) {
                        this.minutes = this.minutesSet
                        this.seconds = 0
                        if (this.shortBreak == true) {
                            this.shortBreak = false
                            this.currentShortBreak++
                        }
                        else {
                            this.longBreak = false
                            this.currentLongBreak++
                        }
                    }
                    else if (this.currentSession < this.numSessionsSet) {
                        if (this.currentSession % 4 == 0) {
                            this.longBreak = true
                            this.minutes = this.longBreakMinutesSet
                            this.seconds = 0
                            this.currentSession++
                        }
                        else {
                            this.shortBreak = true
                            this.minutes = this.shortBreakMinutesSet
                            this.seconds = 0
                            this.currentSession++
                        }
                    }
                    else {
                        //display cool congratulations animation 
                        this.minutes = this.minutesSet
                        this.seconds = 0
                        this.currentSession = 1
                        this.currentLongBreak = 1
                        this.currentShortBreak = 1
                    }
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
            },
            pauseTimer() {
                this.running = false
                this.paused = true
                clearInterval(this.timerInterval)
            },
            resetTimer() {
                if (this.running || this.paused) {
                    let reset = confirm("Resetting the timer will reset the whole pomodoro sitting back to session 1 (not just this session!) The time you have worked for so far in the session will be saved. Are you sure?")
                    if (reset == true) {
                        this.stopTimer()
                        this.minutes = this.minutesSet
                        this.seconds = 0
                        this.currentSession = 1
                        this.currentLongBreak = 1
                        this.currentShortBreak = 1
                        this.shortBreak = false
                        this.longBreak = false
                    }
                }
                else {
                    this.minutes = this.minutesSet
                    this.seconds = 0
                    this.currentSession = 1
                    this.currentLongBreak = 1
                    this.currentShortBreak = 1
                    this.shortBreak = false
                    this.longBreak = false
                }
            },
        },
        getters:
        {
            millisecondsLeft: (state) => ((state.minutes * 60) + (state.seconds)) * 1000,
            millisecondsGone: (state) => (state.minutesSet * 60000 - state.millisecondsLeft),
            percentageProgress: (state) => (state.millisecondsGone / (state.minutesSet * 60000)) * 100
        }
    })