import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer',
    {
        state:()=>{timerRunning:false
                   timerPaused:false},
        actions:{
            setRunning()
            {
                this.timerRunning=true
            },
            setNotRunning()
            {
                this.timerRunning=false
            },
            setPaused()
            {
                this.timerPaused=true
            },
            setNotPaused()
            {
                this.timerPaused=false
            }
        },
        getters:
        {
            getRunningOrPaused()
            {
                return this.timerRunning && this.timerPaused
            }
        }
    })