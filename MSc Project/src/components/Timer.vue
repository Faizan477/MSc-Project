<script>
import { useStudyTimerStore } from '../stores/StudyTimerStore.js';
import { mapStores } from 'pinia'
import FiveMinuteTimer from './FiveMinuteTimer.vue'
import StudyTimer from './StudyTimer.vue'
export default
    {
        data() {
            return { standardTimer: false }
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
            async submitCheckInReflection(value)
            {
                const response = await fetch("http://localhost:8000/check_in_evaluation/",
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() },
                        body: JSON.stringify({ 'timestamp': new Date(Date.now()).toISOString(), 'focusing_value':value })
                    })
                let created = await response.json()
                if (created.created != true) {
                    alert("An error occured saving the check-in.")
                }
            }
        }
    }
</script>
<template>
    <div class="d-flex flex-column align-items-center">
        <h4 class="align-self-start">Start a session</h4>
        <div v-if="studyTimerStore.showCheckIn" class="alert alert-info w-100 alert-dismissible">
            <div class="d-flex justify-content-between">
                <strong>Are you focusing?</strong>
                <button type="button" class="btn btn-dark close" data-bs-dismiss="alert" @click="submitCheckInReflection(1)">Yes <i
                        class="bi bi-coin">+50</i> </button>
                <button type="submit" class="btn btn-dark close" data-bs-dismiss="alert" @click="submitCheckInReflection(0.67)">Sort of <i
                        class="bi bi-coin">+45</i></button>
                <button type="submit" class="btn btn-dark close" data-bs-dismiss="alert" @click="submitCheckInReflection(0.33)">No <i
                        class="bi bi-coin">+40</i></button>
            </div>
            <br>
            <div class="progress">
                <div class="progress-bar bg-danger" role="progressbar" :style="{ width: studyTimerStore.percentageProgressCheckIn + '%' }"></div>
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