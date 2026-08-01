<script>
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Line } from 'vue-chartjs'
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)
export default
    {
        components: { Line },
        data() {
            return
            {
                minutesSpent: 0
                allTimeStats: true
                overallConcentrationRatings: []
                distractions: []
                checkInEvaluations: []
                overallConcentrationData:
                {
                    labels:[]
                    datasets:[
                    {
                        label:''
                    }
                    ]

                }
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
                let response = await fetch("/api//user_time_spent/", { credentials: 'include' })
                this.minutesSpent = await response.json()
            },
            async getOverallConcentrationRatings() {
                let response = await fetch("/api//overall_concentration_evaluation_graph/", { credentials: 'include' })
                this.overallConcentrationRatings = await response.json()
            },
            async getDistractions() {
                let response = await fetch("/api//distractions_evaluation_graph/", { credentials: 'include' })
                this.distractions = await response.json()
            },
            async getCheckInEvaluations() {
                let response = await fetch("/api//check_in_evaluation/", { credentials: 'include' })
                this.checkInEvaluations = await response.json()
            },
        }
    }
</script>
<template>
    <div class="d-flex flex-column">
        <h4 class="align-self-center">Statistics</h4>
        <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-secondary p-1 bg-dark text-light nav-link">All time</button>
        </div>
    </div>
</template>