<script>
export default
    {
        data() 
        {
            minutes:5
            seconds:0
        }
    }
</script>
<template>
    <div class="progress w-100">
        <div class="progress-bar" role="progressbar" style="width:50%" aria-valuenow="0" aria-valuemin="0"
            aria-valuemax="100"></div>
    </div>
    <div class="d-flex flex-column align-items-center">
        <h6>Trouble starting a task?</h6>
        <h6>Work for only 5 minutes!</h6>
    </div>
</template>