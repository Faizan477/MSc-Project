<script>
    import TaskDate from './TaskDate.vue';
    const months=['January','February','March','April','May','June','July','August','September','October','November','December']
    const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    export default{
    data()
    {
        return{
            dateString:'',
            date:'',
            dateArray:[],
            dateStringArray:[]}
    },
    mounted()
    {
        this.dateString=this.convertToDateString(Date.now())
        this.date=this.convertToDate(Date.now())
        this.createDateArray()
        this.createDateStringArray()
        console.log(this.dateString)
        console.log(this.date)
        console.log(this.dateArray)
        console.log(this.dateStringArray)
    },
    components:
    {
        TaskDate
    },
    methods:
    {
        convertToDateString(time_since_epoch)
        {
            time_since_epoch=new Date(time_since_epoch)
            return days[time_since_epoch.getDay()]+" "+
            time_since_epoch.getDate()+" "+
            months[time_since_epoch.getMonth()]+" "+
            time_since_epoch.getFullYear()
        },
        convertToDate(time_since_epoch)
        {
            time_since_epoch=new Date(time_since_epoch)
            return time_since_epoch.getFullYear()+"-"+
            (time_since_epoch.getMonth()+1).toString().padStart(2,"0")+"-"+
            time_since_epoch.getDate().toString().padStart(2,"0")
        },
        createDateArray()
        {
            this.dateArray=[this.convertToDate(Date.now()),
            this.convertToDate(Date.now()+86400000),
            this.convertToDate(Date.now()+172800000),
            this.convertToDate(Date.now()+259200000),
            this.convertToDate(Date.now()+345600000),
            this.convertToDate(Date.now()+432000000),
            this.convertToDate(Date.now()+518400000)
            ]
        },
        createDateStringArray()
        {
            this.dateStringArray=[this.convertToDateString(Date.now()),
            this.convertToDateString(Date.now()+86400000),
            this.convertToDateString(Date.now()+172800000),
            this.convertToDateString(Date.now()+259200000),
            this.convertToDateString(Date.now()+345600000),
            this.convertToDateString(Date.now()+432000000),
            this.convertToDateString(Date.now()+518400000)
            ]
        },
        handleLeftButton()
        {
            let index=this.dateArray.indexOf(this.date)
            if(index!=0)
            {
                this.date=this.dateArray[index-1]
                this.dateString=this.dateStringArray[index-1]
            }
        },
        handleRightButton()
        {
            let index=this.dateArray.indexOf(this.date)
            if(index!=(this.dateArray.length-1))
            {
                this.date=this.dateArray[index+1]
                this.dateString=this.dateStringArray[index+1]
            }
        }
    }
}
</script>
<template>
    <div class="d-flex flex-column align-items-center">
        <h4 class="align-self-start">Tasks</h4>
    </div>
    <div class="d-flex justify-content-center">
        <button @click="handleLeftButton" class="bi bi-arrow-left-square-fill me-3" style="font-size:1.75em; border:none; padding:0; margin:0; background-color: transparent; "></button>
        <h6>{{ dateString }}</h6>
        <button @click="handleRightButton" class="bi bi-arrow-right-square-fill ms-3" style="font-size: 1.75em; border:none; padding:0; margin:0; background-color: transparent;"></button>
    </div>
    <TaskDate class="h-100" v-bind:selected-date="date"/>
</template>