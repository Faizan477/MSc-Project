<script>
import { useStudyTimerStore } from '../stores/StudyTimerStore.js';
import { mapStores } from 'pinia'
import timer1 from '../assets/timerAlarmSounds/timer1.mp3'
export default
    {
        data() {
            return {
                minutesSet: 25,
                shortBreakMinutesSet: 5,
                longBreakMinutesSet: 15,
                numSessionsSet: 6,
                timerAlarmSound:'timer1.mp3'
            }
        },
        computed:
        {
            ...mapStores(useStudyTimerStore)
        },
        methods:
        {
            setValidTimerSettings() {
                this.studyTimerStore.minutesSet = this.minutesSet
                this.studyTimerStore.shortBreakMinutesSet = this.shortBreakMinutesSet
                this.studyTimerStore.longBreakMinutesSet = this.longBreakMinutesSet
                this.studyTimerStore.numSessionsSet = this.numSessionsSet
                this.studyTimerStore.timerAlarmSound=this.timerAlarmSound
                this.studyTimerStore.resetTimer()
            },
            playTrialSound() {
                let sound = new Howl({ src: [timer1] })
                sound.play()
            }
        }
    }
</script>
<template>
    <div class="d-flex flex-column align-items-center">
        <div class="progress w-100">
            <div class="progress-bar progress-bar-striped bg-success" role="progressbar"
                :style="{ width: studyTimerStore.percentageProgress + '%' }"
                :aria-valuenow="studyTimerStore.millisecondsGone" :aria-valuemin="0"
                :aria-valuemax="(studyTimerStore.minutesSet) * 60000"></div>
        </div>
        <br>
        <p v-if="!(studyTimerStore.longBreak || studyTimerStore.shortBreak)">Session {{ studyTimerStore.currentSession }} of {{ studyTimerStore.numSessionsSet }} </p>
        <p v-else-if="studyTimerStore.longBreak">Long break {{ studyTimerStore.currentLongBreak }} of {{ Math.floor(studyTimerStore.numSessionsSet/4)  }}</p>
        <p v-else>Short break {{ studyTimerStore.currentShortBreak }} of {{  }}</p>
        <button v-show="!(studyTimerStore.running || studyTimerStore.paused)" class="bi bi-gear"
            style="transform:scale(2.5);" data-bs-toggle="modal" data-bs-target="#timerSettingsModal"></button>
        <div class="modal fade" id="timerSettingsModal" role="dialog" aria-labelledby="timerSettingsModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="timerSettingsModalLabel">Timer Settings</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="setValidTimerSettings()" class="d-flex flex-column align-items-center">
                            <p>Total productive time: {{ minutesSet * numSessionsSet }} minutes </p>
                            <p>Total time (including breaks)</p>
                            <label for="sessionLength">Session length (minutes) How long do you want to work in one
                                sitting before a short break?</label>
                            <input type="number" id="sessionLength" class="w-100" v-model="minutesSet" min="1" max="120"
                                placeholder="Please enter a value between 1 and 120" maxlength="3">
                            <label for="shortBreakLength">Short Break Length (this is the length of the break between
                                sessions)</label>
                            <input type="number" id="shortBreakLength" class="w-100" v-model="shortBreakMinutesSet"
                                min="1" max="60" placeholder="Please enter a value between 1 and 60" maxlength="2">
                            <label for="longBreakLength">Long Break Length (this is the length of the break after 4
                                sessions have been completed)</label>
                            <input type="number" id="longBreakLength" class="w-100" v-model="longBreakMinutesSet"
                                :min="shortBreakMinutesSet" max="240"
                                :placeholder="'Please enter a value between ' + shortBreakMinutesSet + ' and 240'"
                                maxlength="3">
                            <label for="numSessions">Number of sessions in this sitting</label>
                            <input type="number" id="numSessions" class="w-100" v-model="numSessionsSet" min="1"
                                max="100" placeholder="Please enter a value between 1 and 100" maxlength="3">
                            <p>Timer Ping sound (plays when the time is up)</p>
                            <div class="d-flex justify-content-around">
                                <input type="radio" v-model="timerAlarmSound" name="timerAlarm" value="" id="1">
                                <label for="1" class="me-3">[Alarm 1]</label>
                                <input type="radio" v-model="timerAlarmSound" name="timerAlarm" value="" id="2">
                                <label for="2" class="me-3">[Alarm 2]</label>
                                <input type="radio" v-model="timerAlarmSound" name="timerAlarm" value="" id="3">
                                <label for="3">[Alarm 3]</label>
                            </div>

                            <div class="d-flex justify-content-evenly">
                                <button class="bi bi-play-circle-fill me-5" @click="playTrialSound()"></button>
                                <button class="bi bi-play-circle-fill me-5"></button>
                                <button class="bi bi-play-circle-fill"></button>
                            </div>
                            <br>
                            <div class="d-flex justify-content-center">
                                <button v-if="(minutesSet == '' || shortBreakMinutesSet == '' || longBreakMinutesSet == '' || numSessionsSet == ''
                                    || minutesSet < 1 || shortBreakMinutesSet < 1 || longBreakMinutesSet < shortBreakMinutesSet || numSessionsSet < 1
                                    || Number.isInteger(minutesSet) == false || Number.isInteger(shortBreakMinutesSet) == false || Number.isInteger(longBreakMinutesSet) == false
                                    || Number.isInteger(numSessionsSet) == false || minutesSet > 120 || shortBreakMinutesSet > 60 || longBreakMinutesSet > 240 || numSessionsSet > 100
                                )" type="button" class="btn btn-success w-30 me-3" disabled>Done</button>
                                <button v-else type="submit" class="btn btn-success w-30 me-3" data-bs-toggle="modal"
                                    data-bs-target="#timerSettingsModal">Done</button>
                                <br>
                                <button type="button" class="btn btn-secondary w-30"
                                    data-bs-dismiss="modal">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="lead fs-1 mt-3" style="transform:scale(1.25)">
            {{ studyTimerStore.minutes.toString().padStart(2, '0') }}:{{ studyTimerStore.seconds.toString().padStart(2,
                '0') }}
            {{ text }}
        </div>
        <div class="d-flex justify-content-center">
            <button v-if="studyTimerStore.running" class="btn btn-secondary" type="button"
                @click="studyTimerStore.pauseTimer">Pause</button>
            <button v-else class="btn btn-secondary" type="button"
                @click="studyTimerStore.startPomodoroTimer">Start</button>
            <button class="btn btn-secondary ms-3" type="button" @click="studyTimerStore.resetTimer">Reset</button>
        </div>
    </div>
</template>