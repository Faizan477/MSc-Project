import { defineStore } from 'pinia'
import { Howl, Howler } from 'howler'
import { Modal } from 'bootstrap'
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
                checkInEndTime:0,
                currentSession: 1,
                currentShortBreak: 1,
                currentLongBreak: 1,
                shortBreak: false,
                longBreak: false,
                timerAlarmSound: 'timer1',
                numCheckIns:5,
                randomIntervals:false,
                sittingStarted:false,
                tasksForCurrentSession:[],
                checkInSound:true,
                intervals:[],
                showCheckIn:false,
                showSelfReflectionModal:false,
                checkInStartTime:0,
                millisecondsLeftCheckIn:0,
                percentageProgressCheckIn:100
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
                    this.sittingStarted=true
                    this.determineCheckInIntervals()
                    this.startTimer()
                }
            },
            determineCheckInIntervals()
            {
                if(this.randomIntervals==true)
                {
                    console.log("Random interval selected")
                    for(let i=0;i<this.numCheckIns;i++)
                    {
                        let seconds=this.minutesSet*60
                        let secondsRange=seconds-30 //so that there won't be a check-in half a minute prior to the end of the session 
                        let interval=(Math.floor(Math.random()*secondsRange))*1000
                        this.intervals.push(interval)
                    }
                    this.intervals=this.intervals.sort((a,b)=>a-b).reverse()
                }
                else if(this.randomIntervals==false)
                {
                    console.log("Regular interval selected")
                    let seconds=this.minutesSet*60
                    let i=1
                    let interval=(seconds/(this.numCheckIns+1))*1000
                    while(i<this.numCheckIns+1)
                    {
                        this.intervals.push(interval*i)
                        i++
                    }
                    this.intervals=this.intervals.reverse()
                }
                console.log(this.intervals)
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
                        this.determineCheckInIntervals()
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
                    this.showSelfReflectionModal=true
                    this.toggleSelfReflectionModal()
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
                        this.showSelfReflectionModal=true
                        this.toggleSelfReflectionModal()
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
                        this.showSelfReflectionModal=true
                        this.toggleSelfReflectionModal()
                        this.sittingStarted=false
                        this.minutes = this.minutesSet
                        this.seconds = 0
                        this.currentSession = 1
                        this.currentLongBreak = 1
                        this.currentShortBreak = 1
                    }
                }
                else {
                    if((this.intervals.at(0)+this.startTime) - Date.now() <=0)
                    {
                        this.checkInStartTime=Date.now()
                        this.checkInEndTime=Date.now()+20000
                        console.log("Currently triggering the check in command")
                        this.showCheckIn=true
                        this.intervals.shift()
                    }
                    if(this.showCheckIn && this.checkInEndTime-Date.now()<=0)
                    {
                        this.showCheckIn=false
                    }
                    else if(this.showCheckIn)
                    {
                        //updating the progress bar
                        this.updateProgressBar()
                    }
                    console.log(Date.now())
                    console.log("Check-in percentage progress"+this.percentageProgressCheckIn)
                    console.log(this.checkInEndTime)
                    this.minutes = Math.trunc(((this.endTime - Date.now()) / 60000))
                    this.seconds = Math.trunc(((this.endTime - Date.now()) % 60000) / 1000)
                }
            },
            toggleSelfReflectionModal()
            {
                const selfReflectionModal=Modal.getOrCreateInstance(document.getElementById('selfReflectionModal'))
                selfReflectionModal.toggle()
            },
            updateProgressBar()
            {
                this.millisecondsLeftCheckIn=this.checkInEndTime-Date.now()
                this.percentageProgressCheckIn=(this.millisecondsLeftCheckIn /20000)*100
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
                this.intervals=[]
                this.tasksForCurrentSession=[]
                this.sittingStarted=false
            },
        },
        getters:
        {
            millisecondsLeft: (state) => ((state.minutes * 60) + (state.seconds)) * 1000,
            millisecondsGone(state)
            {
                if(this.longBreak)
                {
                    return state.longBreakMinutesSet * 60000 - state.millisecondsLeft
                }
                else if(this.shortBreak)
                {
                    return state.shortBreakMinutesSet * 60000 - state.millisecondsLeft
                }
                else
                {
                    return state.minutesSet * 60000 - state.millisecondsLeft
                }
            },
            percentageProgress: (state) => (state.millisecondsGone / (state.minutesSet * 60000)) * 100,
        }
    })