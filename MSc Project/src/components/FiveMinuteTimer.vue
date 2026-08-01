<script>
import { useFiveMinuteTimerStore } from '../stores/FiveMinuteTimerStore';
import { mapStores } from 'pinia'
export default
    {
        computed:
        {
            ...mapStores(useFiveMinuteTimerStore)
        },
        methods:
        {
            switchToStandardTimer()
            {
                this.$emit('switchToStandardTimer')
            },
        }
    }
</script>
<template>
    <div v-if="prompt" class="d-flex flex-column align-items-center">
        <h6 class="mt-4">In the flow? Let's start a session!</h6>
        <button type="button" class="btn btn-secondary mt-4" @click="switchToStandardTimer">Yes! Bring it
            on.</button>
        <button type="button" class="btn btn-secondary mt-3" @click="fiveMinuteTimerStore.removePrompt">I need another 5 minutes to get into the
            flow.</button>
    </div>
    <div v-else class="d-flex flex-column align-items-center">
        <div class="progress w-100">
            <div class="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar"
                :style="{ width: fiveMinuteTimerStore.percentageProgress + '%' }" :aria-valuenow="fiveMinuteTimerStore.millisecondsGone" :aria-valuemin="0"
                :aria-valuemax="300000"></div>
        </div>
        <h6>Trouble starting a task?</h6>
        <h6>Work for only 5 minutes!</h6>
        <div class="lead fs-1" style="transform:scale(1.25)">
            {{ fiveMinuteTimerStore.minutes.toString().padStart(2, '0') }}:{{ fiveMinuteTimerStore.seconds.toString().padStart(2, '0') }}
            {{ text }}
        </div>
        <div class="d-flex justify-content-center p-3" style="transform:scale(2.5)">
            <button v-if="fiveMinuteTimerStore.fiveMinuteRunning" class="bi bi-pause-circle" type="button"
                @click="fiveMinuteTimerStore.pauseTimer"></button>
            <button v-else class="bi bi-play-circle" type="button" @click="fiveMinuteTimerStore.startTimer"></button>
            <button class="bi bi-bootstrap-reboot ms-3 vh-50 vw-50" type="button" @click="fiveMinuteTimerStore.resetTimer"></button>
        </div>
    </div>
</template>