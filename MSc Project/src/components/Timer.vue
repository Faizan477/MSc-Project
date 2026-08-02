<script>
import { useStudyTimerStore } from '../stores/StudyTimerStore.js';
import { useFiveMinuteTimerStore } from '../stores/FiveMinuteTimerStore.js';
import { mapStores } from 'pinia'
import FiveMinuteTimer from './FiveMinuteTimer.vue'
import StudyTimer from './StudyTimer.vue'
export default
    {
        data() {
            return {
                standardTimer: false,
                showInterventions: false,
                breathingExercise: false,
                breathingMinutes: 2,
                breathingSeconds: 0,
                breathingTimerInterval: '',
                breathingTimerRunning: false,
                breathingStartTime: 0,
                breathingEndTime: 0,
                lastToggledSecond:0,
                inhale: true,
                showPrompt: false
            }
        },
        components:
        {
            FiveMinuteTimer,
            StudyTimer
        },
        computed:
        {
            ...mapStores(useStudyTimerStore)
        },
        methods:
        {
            async getCsrfCookie() {
                let csrfCookie = await cookieStore.get('csrftoken')
                console.log(csrfCookie.value.length)
                return csrfCookie.value
            },
            handle5MinuteTimerToggleButton() {
                if (this.standardTimer == true) {
                    this.standardTimer = false
                }
            },
            handleStandardTimerToggleButton() {
                if (this.standardTimer == false) {
                    this.standardTimer = true
                }
            },
            async submitCheckInReflection(value) {
                this.studyTimerStore.showCheckIn=false
                const response = await fetch("/api/check_in_evaluation/",
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() },
                        body: JSON.stringify({ 'timestamp': new Date(Date.now()).toISOString(), 'focusing_value': value })
                    })
                let created = await response.json()
                if (created.created != true) {
                    alert("An error occured saving the check-in.")
                }
                if (value <= 0.67) {
                    this.showInterventions = true
                }
            },
            startBreathingExercise() {
                this.breathingExercise = true
                this.showPrompt = false
                this.showInterventions = true
                const fiveMinuteStore = useFiveMinuteTimerStore()
                if (this.studyTimerStore.running) {
                    this.studyTimerStore.pauseTimer()
                }
                else if (fiveMinuteStore.fiveMinuteRunning) {
                    this.fiveMinuteTimerStore.pauseTimer()
                }
                this.startBreathingTimer()
            },
            startBreathingTimer() {
                this.breathingStartTime = Date.now()
                this.breathingEndTime = this.breathingStartTime + 120000
                this.breathingTimerRunning = true
                this.breathingTimerInterval = setInterval(() => { this.updateBreathingTimer() }, 100)
            },
            async updateBreathingTimer() {
                if (this.breathingEndTime - Date.now() <= 0) {
                    this.stopBreathingTimer()
                    this.showPrompt = true
                }
                else {
                    if (((this.breathingMinutes * 60) + (this.breathingSeconds)) % 3 == 0) {
                        if(this.lastToggledSecond!=this.breathingSeconds)
                        {
                            this.lastToggledSecond=this.breathingSeconds
                            this.toggleBreathingStyle()
                        }
                    }
                    this.breathingMinutes = Math.trunc(((this.breathingEndTime - Date.now()) / 60000))
                    this.breathingSeconds = Math.trunc(((this.breathingEndTime - Date.now()) % 60000) / 1000)
                }
            },
            stopBreathingTimer() {
                this.showInterventions=false
                this.showPrompt=false
                this.breathingExercise = false
                this.breathingTimerRunning = false
                clearInterval(this.breathingTimerInterval)
                this.breathingMinutes = 2
                this.breathingSeconds = 0
            },
            toggleBreathingStyle() {
                if (this.inhale == false) {
                    this.inhale = true
                }
                else if (this.inhale == true) {
                    this.inhale = false
                }
            }
        }
    }
</script>
<template>
    <div class="d-flex flex-column align-items-center">
        <h4 class="align-self-start">Start a session</h4>
        <div v-if="studyTimerStore.showCheckIn" class="alert alert-secondary w-100 alert-dismissible">
            <div class="d-flex justify-content-between">
                <strong>Are you focusing?</strong>
                <button type="button" class="btn btn-dark close"
                    @click="submitCheckInReflection(1)">Yes </button>
                <button type="submit" class="btn btn-dark close"
                    @click="submitCheckInReflection(0.67)">Sort of</button>
                <button type="submit" class="btn btn-dark close"
                    @click="submitCheckInReflection(0.33)">No</button>
            </div>
            <br>
            <div class="progress">
                <div class="progress-bar bg-danger" role="progressbar"
                    :style="{ width: studyTimerStore.percentageProgressCheckIn + '%' }"></div>
            </div>
        </div>
        <div v-if="showInterventions" class="alert alert-secondary w-100 alert-dismissible d-flex flex-column">
            <div v-if="breathingExercise!=true && showPrompt!=true" class="d-flex justify-content-between">
                <strong>Would you like to try a short exercise to help you focus?</strong>
                <button type="button" class="btn btn-dark" @click="startBreathingExercise()">Start Breathing exercise</button>
                <button type="button" class="btn btn-close" data-bs-dismiss="alert"></button>
            </div>
            <div v-if="breathingExercise!=true && showPrompt==true">
                <p v-if="showPrompt">Nice! You can now close this pop-up and resume the timer!</p>
                <button type="button" class="btn btn-close" data-bs-dismiss="alert"></button>
            </div>
            <div v-else class="d-flex flex-column align-items-center">
                <button type="button" class="btn btn-close" data-bs-dismiss="alert"
                    @click="stopBreathingTimer()"></button>
                <div class="fs-3">
                    {{ this.breathingMinutes.toString().padStart(2, '0') }}:{{
                        this.breathingSeconds.toString().padStart(2,
                    '0') }}
                </div>
                <h5 v-if="inhale">Inhale</h5>
                <h5 v-else>Exhale</h5>
            </div>
        </div>

        <div v-if="standardTimer" class="d-flex justify-content-center">
            <button type="button" class="btn btn-secondary nav-link me-5"
                @click="handle5MinuteTimerToggleButton">5-minute timer</button>
            <button type="button" class="btn btn-secondary bg-light text-dark nav-link"
                @click="handleStandardTimerToggleButton">Standard Timer</button>
        </div>
        <div v-else class="d-flex justify-content-center">
            <button type="button" class="btn btn-secondary bg-light text-dark nav-link me-5"
                @click="handle5MinuteTimerToggleButton">5-minute timer</button>
            <button type="button" class="btn btn-secondary nav-link" @click="handleStandardTimerToggleButton">Standard
                Timer</button>
        </div>
        <div v-if="standardTimer">
            <StudyTimer></StudyTimer>
        </div>
        <div v-else>
            <FiveMinuteTimer @switchToStandardTimer="handleStandardTimerToggleButton()"></FiveMinuteTimer>
        </div>
    </div>
</template>