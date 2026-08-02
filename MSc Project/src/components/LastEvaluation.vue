<script>
import { useFiveMinuteTimerStore } from '../stores/FiveMinuteTimerStore';
import { mapStores } from 'pinia'
export default
    {
        props: ['lastTaskProgress', 'lastOverallEvaluation', 'lastDistractions'],
        async mounted() 
        {
            await this.getLastEvaluation()
        }
    }
</script>
<template>
    <div class="row m-0">
        <div class="col">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex flex-column align-items-center">
                        <p class="card-text">Your self-reflection from last time: </p>
                        <div v-if="lastOverallEvaluation[0].red == 1" class="card-text">
                            <div class="bg-danger rounded-circle" style="width: 1.5rem; height: 1.5rem;"></div>
                        </div>
                        <div v-else-if="lastOverallEvaluation[0].amber == 1" class="card-text">
                            <div class="bg-warning rounded-circle" style="width: 1.5rem; height: 1.5rem;"></div>
                        </div>
                        <div v-else-if="lastOverallEvaluation[0].green == 1" class="card-text">
                            <div class="bg-success rounded-circle" style="width: 1.5rem; height: 1.5rem;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex flex-column justify-content-start">
                        <p v-if="lastDistractions[0].zoning_out == 1 && lastDistractions[0].phone == 1 && lastDistractions[0].starting_other_tasks == 1 && lastDistractions[0].eating == 1"
                            class="card-text">
                            You didn't report any distractions last time. Keep it up!
                        </p>
                        <div v-else>
                            <p class="card-text">Distractions from last time:</p>
                            <ul>
                                <li v-if="lastDistractions[0].zoning_out <= 0.67" class="card-text">
                                    Zoning out
                                    <i class="bi bi-moon-stars"></i>
                                </li>
                                <li v-if="lastDistractions[0].phone <= 0.67" class="card-text">
                                    Using your phone
                                    <i class="bi bi-phone"></i>
                                </li>
                                <li v-if="lastDistractions[0].starting_other_tasks <= 0.67" class="card-text">
                                    Starting other tasks
                                    <i class="bi bi-book"></i>
                                </li>
                                <li v-if="lastDistractions[0].eating <= 0.67" class="card-text">
                                    Eating
                                    <i class="bi bi-cookie"></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex flex-column align-items-center">
                        <p class="card-text flex-fill">What you said you wanted to improve on this time:</p>
                        <p class="card-text flex-fill ms-auto">"{{ lastTaskProgress[0].improvement }}"</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>