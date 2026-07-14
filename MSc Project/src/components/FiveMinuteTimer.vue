<script>
import { mapStores } from 'pinia'
import { useTimerStore } from '../stores/TimerStore';
export default
    {
        data() {
            return {
                minutes: 5,
                seconds: 0,
                timerInterval: '',
                paused:false,
                running:false,
                startTime: 0,
                endTime: 0,
                prompt: false
            }
        },
        computed:
        {
            millisecondsLeft() {
                return ((this.minutes * 60) + (this.seconds)) * 1000
            },
            millisecondsGone() {
                let millisecondsInFiveMinutes = 300000
                return millisecondsInFiveMinutes - this.millisecondsLeft
            },
            percentageProgress() {
                return (this.millisecondsGone / 300000) * 100
            }
        },
        methods:
        {
            startTimer() {
                if (this.paused == true) {
                    this.running=true
                    this.paused=false
                    this.endTime = Date.now() + this.millisecondsLeft
                    this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
                }
                else {
                    this.startTime = Date.now()
                    this.endTime = this.startTime + 300000
                    this.running=true
                    this.timerInterval = setInterval(() => { this.updateTimer() }, 100)
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
                this.running=false
                this.paused=false
                clearInterval(this.timerInterval)
                this.minutes = 5
                this.seconds = 0
            },
            pauseTimer() {
                this.running=false
                this.paused=true
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
            }
        }
    }
</script>
<template>
    <div v-if="prompt" class="d-flex flex-column align-items-center">
        <h6>In the flow? Let's start a session!</h6>
        <button type="button" class="btn btn-secondary" @click="handleStandardTimerToggleButton">Yes! Bring it
            on.</button>
        <button type="button" class="btn btn-secondary" @click="removePrompt">I need another 5 minutes to get into the
            flow.</button>
    </div>
    <div v-else class="d-flex flex-column align-items-center">
        <div class="progress w-100">
            <div class="progress-bar progress-bar-striped bg-info" role="progressbar"
                :style="{ width: percentageProgress + '%' }" :aria-valuenow="millisecondsGone" :aria-valuemin="0"
                :aria-valuemax="300000"></div>
        </div>
        <h6>Trouble starting a task?</h6>
        <h6>Work for only 5 minutes!</h6>
        <div class="lead fs-1" style="transform:scale(1.25)">
            {{ minutes.toString().padStart(2, '0') }}:{{ seconds.toString().padStart(2, '0') }}
            {{ text }}
        </div>
        <div class="d-flex justify-content-center">
            <button v-if="running" class="btn btn-secondary" type="button"
                @click="pauseTimer">Pause</button>
            <button v-else class="btn btn-secondary" type="button" @click="startTimer">Start</button>
            <button class="btn btn-secondary ms-3" type="button" @click="resetTimer">Reset</button>
        </div>
    </div>
</template>