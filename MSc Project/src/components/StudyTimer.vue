<script>
import { useStudyTimerStore } from '../stores/StudyTimerStore.js';
import { mapStores } from 'pinia'
export default
    {
        computed:
        {
            ...mapStores(useStudyTimerStore)
        },
    }
</script>
<template>
    <div class="d-flex flex-column align-items-center">
        <div class="progress w-100">
            <div class="progress-bar progress-bar-striped bg-success" role="progressbar"
                :style="{ width: studyTimerStore.percentageProgress + '%' }" :aria-valuenow="studyTimerStore.millisecondsGone" :aria-valuemin="0"
                :aria-valuemax="(studyTimerStore.minutesSet)*60000"></div>
        </div>
        <br>
        <button v-show="!(studyTimerStore.running || studyTimerStore.paused)" class="bi bi-gear" style="transform:scale(2.5);"></button>
        <div class="lead fs-1 mt-3" style="transform:scale(1.25)">
            {{ studyTimerStore.minutes.toString().padStart(2, '0') }}:{{ studyTimerStore.seconds.toString().padStart(2, '0') }}
            {{ text }}
        </div>
        <div class="d-flex justify-content-center">
            <button v-if="studyTimerStore.running" class="btn btn-secondary" type="button"
                @click="studyTimerStore.pauseTimer">Pause</button>
            <button v-else class="btn btn-secondary" type="button" @click="studyTimerStore.startTimer">Start</button>
            <button class="btn btn-secondary ms-3" type="button" @click="studyTimerStore.resetTimer">Reset</button>
        </div>
    </div>
</template>