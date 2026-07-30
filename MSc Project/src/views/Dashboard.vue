<script>
import Tasks from '../components/Tasks.vue';
import Quotes from '../components/Quotes.vue';
import Timer from '../components/Timer.vue';

export default{
    components:
    {
        Tasks,
        Quotes,
        Timer
    }
}
</script>
<template>
        <div class="d-flex flex-column">
            <h4 class="align-self-center">Command Centre</h4>
            <div class="d-flex justify-content-evenly">
                <div class="h-100 w-25" id="tasks">
                    <Tasks />
                </div>
                <div class="h-100 w-50" id="timer">
                    <Timer />
                </div>
                <div class="h-100 w-25" id="quotes">
                    <Quotes />
                </div>
            </div>
        </div>
</template>