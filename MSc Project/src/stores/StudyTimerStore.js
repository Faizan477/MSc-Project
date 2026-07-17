import { defineStore } from 'pinia'
import { useFiveMinuteTimerStore } from './FiveMinuteTimerStore';
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
                currentSession:1,
                sessionsBeforeLongBreak:1,
                shortBreak:false,
                longBreak:false,
                session:true
            }
        },
        actions: {
            otherTimerRunning()
            {
                const fiveMinuteStore=useFiveMinuteTimerStore()
                console.log("The timer is"+fiveMinuteStore.fiveMinuteRunning)
                return fiveMinuteStore.fiveMinuteRunning
            },
            startPomodoroTimer() {
                if(this.otherTimerRunning())
                {
                    alert("Another timer is currently running. Please reset the existing timer to continue")
                }
                else
                {
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
                    this.startTime = Date.now()
                    this.endTime = this.startTime + (this.minutesSet * 60000)
                    this.running = true
                    this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
                }
            },
            updateTimer() {
                if (this.endTime - Date.now() <= 0) {
                    this.stopTimer()
                    if(this.currentSession<this.numSessionsSet)
                    {
                        if(this.currentSession%4==0)
                        {
                            this.minutes=this.longBreakMinutesSet
                            this.seconds=0
                        }
                        else
                        {
                            this.minutes=this.shortBreakMinutesSet
                            this.seconds=0
                        }
                    }
                    else
                    {
                        //display congratulations message
                        this.currentSession=1
                    }
                    //now set minutes and seconds 
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
            },
            pauseTimer() {
                this.running = false
                this.paused = true
                clearInterval(this.timerInterval)
            },
            resetTimer() {
                this.stopTimer()
                this.minutes=this.minutesSet
                this.seconds=0
            },
        },
        getters:
        {
            millisecondsLeft: (state) => ((state.minutes * 60) + (state.seconds)) * 1000,
            millisecondsGone: (state) => (state.minutesSet * 60000 - state.millisecondsLeft),
            percentageProgress: (state) => (state.millisecondsGone / (state.minutesSet * 60000)) * 100
        }
    })