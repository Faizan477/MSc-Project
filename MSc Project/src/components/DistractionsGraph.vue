<script>
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Line } from 'vue-chartjs'
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)
export default
    {
        components: { Line },
        props: {distractions:Array},
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
                    labels: this.distractions?.map((entry => new Date(entry.timestamp).getDate()+"/"+(new Date(entry.timestamp).getMonth()+1)+"/"+new Date(entry.timestamp).getFullYear()
                +","+new Date(entry.timestamp).getHours()+":"+(new Date(entry.timestamp).getMinutes().toString().padStart(2,"0")))).reverse(),
                    datasets: [{
                        label: 'Avoiding zoning out',
                        data: this.distractions?.map((entry)=>entry.zoning_out).reverse(),
                        borderColor:'orange',
                        backgroundColor:'orange'
                    },
                    {
                        label: 'Avoiding using phone',
                        data: this.distractions?.map((entry)=>entry.phone).reverse(),
                        borderColor:'yellow',
                        backgroundColor:'yellow'
                    },
                    {
                        label: 'Avoiding starting other tasks',
                        data: this.distractions?.map((entry)=>entry.starting_other_tasks).reverse(),
                        borderColor:'black',
                        backgroundColor:'black'
                    },
                    {
                        label: 'Avoiding eating snacks',
                        data: this.distractions?.map((entry)=>entry.eating).reverse(),
                        borderColor:'purple',
                        backgroundColor:'purple'
                    }
                    ]
                }
            }
        },
    }
</script>
<template>
    <div>
        <Line :data="chartData" :options="chartOptions"></Line>
    </div>
</template>