<script>
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Line } from 'vue-chartjs'
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)
export default
    {
        components: { Line },
        props: {checkInEvaluations:Array},
        data() {
            return {
                chartOptions:
                {
                    responsive:true
                }
            }
        },
        computed:
        {
            chartData()
            {
                return {
                    labels: this.checkInEvaluations?.map((entry => new Date(entry.timestamp).getDate()+"/"+(new Date(entry.timestamp).getMonth()+1)+"/"+new Date(entry.timestamp).getFullYear()
                +","+new Date(entry.timestamp).getHours()+":"+(new Date(entry.timestamp).getMinutes().toString().padStart(2,"0")))).reverse(),
                    datasets: [{
                        label: 'In-session check-in evaluation score',
                        data: this.checkInEvaluations?.map((entry)=>entry.focusing_value).reverse(),
                        borderColor:'#1d2d44',
                        backgroundColor:'#1d2d44'
                    }
                    ]
                }
            }
        },
        methods:
        {
            parseOverallFocusRating(entry)
            {
                if(entry.green==1){return 1}
                else if(entry.amber){return 0.67}
                else if(entry.red){return 0.33}
                else{return 0}
            }
        }
    }
</script>
<template>
    <div>
        <Line :data="chartData" :options="chartOptions"></Line>
    </div>
</template>