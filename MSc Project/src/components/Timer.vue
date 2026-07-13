<script>
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
        methods:
        {
            handle5MinuteTimerToggleButton() {
                if (this.standardTimer == true) {
                    this.standardTimer = false
                }
            },
            handleStandardTimerToggleButton() {
                if (this.standardTimer == false) {
                    this.standardTimer = true
                }
            }
        }
    }
</script>
<template>
    <div class="d-flex flex-column align-items-center">
        <h4 class="align-self-start">Start a session</h4>
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
            <FiveMinuteTimer></FiveMinuteTimer>
        </div>
    </div>
</template>