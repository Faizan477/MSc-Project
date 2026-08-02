<script>
import CheckInGraph from '../components/CheckInGraph.vue';
import DistractionsGraph from '../components/DistractionsGraph.vue';
import OverallFocusGraph from '../components/OverallFocusGraph.vue';
export default
    {
        data() {
            return {
                allTimeStats: true,
                overallConcentrationRatings: [],
                distractions: [],
                checkInEvaluations: [],
                minutesSpent:0
            }
        },
        async mounted() {
            await this.getMinutesSpent()
            await this.getOverallConcentrationRatings()
            await this.getDistractions()
            await this.getCheckInEvaluations()
        },
        methods:
        {
            async getMinutesSpent() {
                let response = await fetch("http://localhost:8000//user_time_spent/", { credentials: 'include' })
                this.minutesSpent = await response.json()
                console.log(this.minutesSpent)
            },
            async getOverallConcentrationRatings() {
                let response = await fetch("http://localhost:8000//overall_concentration_evaluation_graph/", { credentials: 'include' })
                this.overallConcentrationRatings = await response.json()
            },
            async getDistractions() {
                let response = await fetch("http://localhost:8000//distractions_evaluation_graph/", { credentials: 'include' })
                this.distractions = await response.json()
            },
            async getCheckInEvaluations() {
                let response = await fetch("http://localhost:8000//check_in_evaluation/", { credentials: 'include' })
                this.checkInEvaluations = await response.json()
            },
        },
        components: { OverallFocusGraph, CheckInGraph, DistractionsGraph }
    }
</script>
<template>
    <div class="d-flex flex-column">
        <h4 class="align-self-center">Statistics</h4>
        <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-secondary p-1 bg-dark text-light nav-link">All time</button>
        </div>
        <div class="row m-0">
            <div class="col d-flex justify-content-center">
                <p v-if="minutesSpent[0]?.minutes_spent > 60">Total productive time: <strong>{{Math.trunc(minutesSpent[0]?.minutes_spent/60)}} hours and {{ minutesSpent[0]?.minutes_spent %60 }} minutes</strong></p>
                <p v-else-if="minutesSpent[0]?.minutes_spent >0"> Total productive minutes: <strong> {{ minutesSpent[0]?.minutes_spent }} </strong></p>
            </div>
        </div>
        <div class="row m-0">
            <div class="col">
                <div class="card h-100">
                    <div class="card-body">
                        <OverallFocusGraph :overall-concentration-ratings="overallConcentrationRatings">
                        </OverallFocusGraph>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card h-100">
                    <div class="card-body">
                        <CheckInGraph :check-in-evaluations="checkInEvaluations"></CheckInGraph>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row m-0">
        <div class="col">
            <div class="card h-100">
                <div class="card-body">
                    <DistractionsGraph :distractions="distractions"></DistractionsGraph>
                </div>
            </div>
        </div>
    </div>
</template>