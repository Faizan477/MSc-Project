<script>
import { Modal } from 'bootstrap';
import { useStudyTimerStore } from '../stores/StudyTimerStore.js';
import { mapStores, mapWritableState } from 'pinia'
import timer1 from '../assets/timerAlarmSounds/timer1.mp3'
import timer2 from '../assets/timerAlarmSounds/timer2.mp3'
import timer3 from '../assets/timerAlarmSounds/timer3.mp3'
import Tasks from './Tasks.vue'
import TaskDate from './TaskDate.vue';
import '../assets/main.css'
export default
    {
        data() {
            return {
                minutesSet: 25,
                shortBreakMinutesSet: 5,
                longBreakMinutesSet: 15,
                numSessionsSet: 6,
                timerAlarmSound: 'timer1',
                tasksForToday: [],
                tasksForCurrentSession: [],
                checkInSound: true,
                numCheckIns: 5,
                randomIntervals: false,
                showCheckIn: false,
                selfReflectionModal: false,
                overallConcentrationRating: '',
                commonDistractionList: [{ id: 1, description: "Zoning out", checked: '' }, { id: 2, description: "Phone", checked: '' },
                { id: 3, description: "Starting other tasks", checked: '' }, { id: 4, description: "Eating snacks", checked: '' }],
                improvement: ''
            }
        },
        computed:
        {
            ...mapStores(useStudyTimerStore),
            ...mapWritableState(useStudyTimerStore, ['showSelfReflectionModal'])
        },
        methods:
        {
            async getCsrfCookie() {
                let csrfCookie = await cookieStore.get('csrftoken')
                console.log(csrfCookie.value.length)
                return csrfCookie.value
            },
            setValidTimerSettings() {
                this.studyTimerStore.minutesSet = this.minutesSet
                this.studyTimerStore.shortBreakMinutesSet = this.shortBreakMinutesSet
                this.studyTimerStore.longBreakMinutesSet = this.longBreakMinutesSet
                this.studyTimerStore.numSessionsSet = this.numSessionsSet
                this.studyTimerStore.timerAlarmSound = this.timerAlarmSound

                this.studyTimerStore.resetTimer()
            },
            setValidCheckInSettings() {
                this.studyTimerStore.randomIntervals = this.randomIntervals
                this.studyTimerStore.tasksForCurrentSession = this.tasksForCurrentSession
                this.studyTimerStore.checkInSound = this.checkInSound
                this.studyTimerStore.numCheckIns = this.numCheckIns
                this.studyTimerStore.startPomodoroTimer()
            },
            playTrialSound1() {
                let sound = new Howl({ src: [timer1] })
                sound.play()
            },
            playTrialSound2() {
                let sound = new Howl({ src: [timer2] })
                sound.play()
            },
            playTrialSound3() {
                let sound = new Howl({ src: [timer3] })
                sound.play()
            },
            convertToDate(time_since_epoch) {
                time_since_epoch = new Date(time_since_epoch)
                return time_since_epoch.getFullYear() + "-" +
                    (time_since_epoch.getMonth() + 1).toString().padStart(2, "0") + "-" +
                    time_since_epoch.getDate().toString().padStart(2, "0")
            },
            filterIncompleteTasks(task) {
                return !(task.completed)
            },
            async fetchTasksForToday() {
                console.log("I am being called")
                let date = encodeURIComponent(this.convertToDate(Date.now()))
                let response = await fetch("http://localhost:8000/task_list/?date=" + date, { credentials: 'include' })
                let tasksForToday = await response.json()
                this.tasksForToday = tasksForToday.filter(this.filterIncompleteTasks)
            },
            clearTasksForToday() {
                this.tasksForToday = []
            },
            async submitReflection() {
                this.studyTimerStore.toggleSelfReflectionModal()
                await this.submitOverallConcentrationReflection()
                await this.submitDistractionsReflection()
                await this.submitLastTasksReflection()
                this.tasksForToday=[]
                this.tasksForCurrentSession=[]
                this.overallConcentrationRating=''
                for(let i=0;i<this.commonDistractionList.length;i++)
                {
                    this.commonDistractionList[i].checked=''
                }
                this.improvement=''
            },
            async submitOverallConcentrationReflection() {
                const response = await fetch("http://localhost:8000/overall_concentration_evaluation/",
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() },
                        body: JSON.stringify({ 'timestamp': new Date(Date.now()).toISOString(), 'red': this.overallConcentrationRating == 'red' ? 1 : 0, 'amber': this.overallConcentrationRating == 'amber' ? 1 : 0, 'green': this.overallConcentrationRating == 'green' ? 1 : 0 })
                    })
                let created = await response.json()
                if (created.created != true) {
                    alert("An error occured submitting the form. Please try again later.")
                }
            },
            async submitDistractionsReflection() {
                let valuesToAdd = [0, 0, 0, 0]
                for (let i = 0; i < this.commonDistractionList.length; i++) {
                    if (this.commonDistractionList[i].checked == 'red') {
                        valuesToAdd[i] = 0.33
                    }
                    else if (this.commonDistractionList[i].checked == 'amber') {
                        valuesToAdd[i] = 0.67
                    }
                    else {
                        valuesToAdd[i] = 1
                    }
                }
                const response = await fetch("http://localhost:8000/distractions_evaluation/",
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() },
                        body: JSON.stringify({ 'timestamp': new Date(Date.now()).toISOString(), 'zoning_out': valuesToAdd[0], 'phone': valuesToAdd[1], 'starting_other_tasks': valuesToAdd[2], 'eating': valuesToAdd[3] })
                    })
                let created = await response.json()
                if (created.created != true) {
                    alert("An error occured submitting the form. Please try again later.")
                }
            },
            async identifyRedTaskToWorkOn() {
                for (let i = 0; i < this.tasksForCurrentSession.length; i++) {
                    if (this.tasksForCurrentSession[i].concentrationRating == 'red') {
                        return this.tasksForCurrentSession[i].id
                    }
                }
                return 0
            },
            async identifyAmberTaskToWorkOn() {
                for (let i = 0; i < this.tasksForCurrentSession.length; i++) {
                    if (this.tasksForCurrentSession[i].concentrationRating == 'amber') {
                        return this.tasksForCurrentSession[i].id
                    }
                }
                return 0
            },
            async submitLastTasksReflection() {
                const response = await fetch("http://localhost:8000/last_task_progress/",
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() },
                        body: JSON.stringify({ 'timestamp': new Date(Date.now()).toISOString(), 'red_task_id': await this.identifyRedTaskToWorkOn(), 'amber_task_id': await this.identifyAmberTaskToWorkOn(), 'improvement': this.improvement })
                    })
                let created = await response.json()
                if (created.created != true) {
                    alert("An error occured submitting the form. Please try again later.")
                }
            },
        }
    }
</script>
<template class="w-100 h-100">
    <div class="d-flex flex-column align-items-center w-100 h-100">
        <div class="progress w-100">
            <div class="progress-bar progress-bar-striped bg-success" role="progressbar"
                :style="{ width: studyTimerStore.percentageProgress + '%' }"
                :aria-valuenow="studyTimerStore.millisecondsGone" :aria-valuemin="0"
                :aria-valuemax="(studyTimerStore.minutesSet) * 60000"></div>
        </div>
        <br>
        <p v-if="!(studyTimerStore.longBreak || studyTimerStore.shortBreak)">Session {{ studyTimerStore.currentSession
        }} of {{ studyTimerStore.numSessionsSet }} </p>
        <p v-else-if="studyTimerStore.longBreak">Long break {{ studyTimerStore.currentLongBreak }} of {{
            Math.floor(studyTimerStore.numSessionsSet / 4) }}</p>
        <p v-else>Short break {{ studyTimerStore.currentShortBreak }} of {{ }}</p>
        <button v-show="!(studyTimerStore.running || studyTimerStore.paused)" class="bi bi-gear"
            style="transform:scale(2.5);" data-bs-toggle="modal" data-bs-target="#timerSettingsModal"></button>
        <div class="modal fade" id="timerSettingsModal" role="dialog" aria-labelledby="timerSettingsModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="timerSettingsModalLabel">Timer Settings</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="setValidTimerSettings()" class="d-flex flex-column align-items-center">
                            <p>Total productive time: {{ minutesSet * numSessionsSet }} minutes </p>
                            <p>Total time (including breaks)</p>
                            <label for="sessionLength">Session length (minutes) How long do you want to work in one
                                sitting before a short break?</label>
                            <input type="number" id="sessionLength" class="w-100" v-model="minutesSet" min="5" max="120"
                                placeholder="Please enter a value between 5 and 120" maxlength="3">
                            <label for="shortBreakLength">Short Break Length (this is the length of the break between
                                sessions)</label>
                            <input type="number" id="shortBreakLength" class="w-100" v-model="shortBreakMinutesSet"
                                min="1" max="60" placeholder="Please enter a value between 1 and 60" maxlength="2">
                            <label for="longBreakLength">Long Break Length (this is the length of the break after 4
                                sessions have been completed)</label>
                            <input type="number" id="longBreakLength" class="w-100" v-model="longBreakMinutesSet"
                                :min="shortBreakMinutesSet" max="240"
                                :placeholder="'Please enter a value between ' + shortBreakMinutesSet + ' and 240'"
                                maxlength="3">
                            <label for="numSessions">Number of sessions in this sitting</label>
                            <input type="number" id="numSessions" class="w-100" v-model="numSessionsSet" min="1"
                                max="100" placeholder="Please enter a value between 1 and 100" maxlength="3">
                            <p>Timer Ping sound (plays when the time is up)</p>
                            <div class="d-flex justify-content-around">
                                <input type="radio" v-model="timerAlarmSound" name="timerAlarm" value='timer1' id="1">
                                <label for="1" class="me-3">Ding</label>
                                <input type="radio" v-model="timerAlarmSound" name="timerAlarm" value='timer2' id="2">
                                <label for="2" class="me-3">Two-tone chime</label>
                                <input type="radio" v-model="timerAlarmSound" name="timerAlarm" value='timer3' id="3">
                                <label for="3">Chime</label>
                            </div>

                            <div class="d-flex justify-content-evenly">
                                <button class="bi bi-play-circle-fill me-5" @click="playTrialSound1"></button>
                                <button class="bi bi-play-circle-fill me-5" @click="playTrialSound2"></button>
                                <button class="bi bi-play-circle-fill" @click="playTrialSound3"></button>
                            </div>
                            <br>
                            <div class="d-flex justify-content-center">
                                <button v-if="(minutesSet == '' || shortBreakMinutesSet == '' || longBreakMinutesSet == '' || numSessionsSet == ''
                                    || minutesSet < 5 || shortBreakMinutesSet < 1 || longBreakMinutesSet < shortBreakMinutesSet || numSessionsSet < 1
                                    || Number.isInteger(minutesSet) == false || Number.isInteger(shortBreakMinutesSet) == false || Number.isInteger(longBreakMinutesSet) == false
                                    || Number.isInteger(numSessionsSet) == false || minutesSet > 120 || shortBreakMinutesSet > 60 || longBreakMinutesSet > 240 || numSessionsSet > 100
                                )" type="button" class="btn btn-success w-30 me-3" disabled>Done</button>
                                <button v-else type="submit" class="btn btn-success w-30 me-3" data-bs-toggle="modal"
                                    data-bs-target="#timerSettingsModal">Done</button>
                                <br>
                                <button type="button" class="btn btn-secondary w-30"
                                    data-bs-dismiss="modal">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="lead fs-1 mt-3" style="transform:scale(1.25)">
            {{ studyTimerStore.minutes.toString().padStart(2, '0') }}:{{ studyTimerStore.seconds.toString().padStart(2,
                '0') }}
        </div>
        <div class="d-flex justify-content-center">
            <button v-if="studyTimerStore.running" class="btn btn-secondary" type="button"
                @click="studyTimerStore.pauseTimer">Pause</button>
            <button v-else-if="studyTimerStore.sittingStarted" class="btn btn-secondary" type="button"
                @click="studyTimerStore.startPomodoroTimer">Start</button>
            <button v-else class="btn btn-secondary" type="button" data-bs-toggle="modal"
                data-bs-target="#initialCheckInModal" @click="fetchTasksForToday()">Start</button>
            <button class="btn btn-secondary ms-3" type="button" @click="studyTimerStore.resetTimer">Reset</button>
        </div>
        <div class="modal fade" id="initialCheckInModal" role="dialog" aria-labelledby="initialCheckInModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="initialCheckInModalLabel">Before you start...</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="clearTasksForToday()" class="d-flex flex-column align-items-center">
                            <div v-if="tasksForToday.length != 0">
                                <p>Select the task(s) you plan to work on during these {{ studyTimerStore.numSessionsSet
                                    }} sessions</p>
                                <div class="form-check" v-for="task in tasksForToday" :key="task.id">
                                    <input class="form-check-input" type="checkbox" :value="task"
                                        v-model="tasksForCurrentSession" :id="'checkBox' + task.id">
                                    <label :for="'checkBox' + task.id" class="form-check-label"
                                        :id="'checkBox' + task.id">{{ task.task_name }}</label>
                                </div>
                            </div>
                            <div v-else>
                                <p>Add tasks to your to-do list for today so you can reflect on your progress.</p>
                            </div>
                            <div>
                                <br>
                                <p>During each session,there will be a series of very brief check-ins to prompt you to
                                    stay as focused as possible. There will also be
                                    a short self-reflection at the end of each session.
                                </p>
                                <label for="numCheckIn">Number of check-ins per session</label>
                                <input type="number" id="numCheckIn" class="w-100" v-model="numCheckIns"
                                    :placeholder="'Please enter a value between 1 and ' + Math.round(minutesSet / 5)"
                                    maxlength="2">
                                <label v-if="this.numCheckIns > 1" for="selectInterval">Random or evenly-spaced (every
                                    {{
                                        Number.parseFloat(this.minutesSet / this.numCheckIns).toFixed(3) }} minutes in your
                                    {{
                                        this.minutesSet }} minute session) intervals?</label>
                                <label v-else for="selectInterval">Random or evenly-spaced (e,g. every 5 minutes in a 25
                                    minute session) intervals?</label>
                                <select v-model="randomIntervals" class="form-select" id="selectInterval">
                                    <option :value=false selected>Regular, evenly-spaced intervals</option>
                                    <option :value=true>Random intervals (you can't predict when the next one is!)
                                    </option>
                                </select>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" id="auditoryCheckIn" type="checkbox"
                                    v-model="checkInSound">
                                <label class="form-check-label" for="auditoryCheckIn">Play a short sound at the start of
                                    each check-in</label>
                            </div>
                            <br>
                            <div class="d-flex justify-content-center">
                                <button
                                    v-if="this.numCheckIns == '' || this.numCheckIns < 1 || this.numCheckIns > (Math.round(minutesSet / 5)) || !(Number.isInteger(this.numCheckIns))"
                                    type="button" class="btn btn-success w-30 me-3" disabled>Done</button>
                                <button v-else type="submit" class="btn btn-success w-30 me-3" data-bs-toggle="modal"
                                    data-bs-target="#initialCheckInModal"
                                    @click="setValidCheckInSettings()">Done</button>
                                <br>
                                <button type="button" class="btn btn-secondary w-30"
                                    data-bs-dismiss="modal">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h1>TEST ONLY - MODAL</h1>
            <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                data-bs-target="#selfReflectionModal">TEST</button>
        </div>
        <div class="modal fade" id="selfReflectionModal" role="dialog" aria-labelledby="selfReflectionModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="selfReflectionModalLabel">Self-reflection time!</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="submitReflection" class="d-flex flex-column justify-content-center">
                            <p class="me-auto fw-bold">Rate your overall focus during these sessions:</p>
                            <div class="d-flex justify-content-center">
                                <div class="form-check">
                                    <input type="radio" id="red" value="red" v-model="overallConcentrationRating"
                                        style="display: none;">
                                    <label for="red">
                                        <div class="bg-danger rounded-circle" style="width: 1.5rem; height: 1.5rem;">
                                        </div>
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input type="radio" id="amber" value="amber" v-model="overallConcentrationRating"
                                        style="display: none;">
                                    <label for="amber">
                                        <div class="bg-warning rounded-circle" style="width: 1.5rem; height: 1.5rem;">
                                        </div>
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input type="radio" id="green" value="green" v-model="overallConcentrationRating"
                                        style="display: none;">
                                    <label for="green">
                                        <div class="bg-success rounded-circle" style="width: 1.5rem; height: 1.5rem;">
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div v-if="tasksForCurrentSession.length != 0">
                                <p class="fw-bold">How much progress do you feel you made towards these tasks?</p>
                                <div v-for="task in tasksForCurrentSession" :key="task.id">
                                    <div class="d-flex justify-content-center">
                                        <p class="me-auto">{{ task.task_name }}</p>
                                        <div class="form-check">
                                            <input type="radio" :name="'radioGroup' + task.id" :id="'red' + task.id"
                                                value="red" v-model="task.concentrationRating" style="display: none;">
                                            <label :for="'red' + task.id">
                                                <div class="bg-danger rounded-circle">
                                                    <div class="bg-danger rounded-circle"
                                                        style="width: 1.5rem; height: 1.5rem;"></div>
                                                </div>
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input type="radio" :name="'radioGroup' + task.id" :id="'amber' + task.id"
                                                value="amber" v-model="task.concentrationRating" style="display: none;">
                                            <label :for="'amber' + task.id">
                                                <div class="bg-warning rounded-circle">
                                                    <div class="bg-warning rounded-circle"
                                                        style="width: 1.5rem; height: 1.5rem;"></div>
                                                </div>
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input type="radio" :name="'radioGroup' + task.id" :id="'green' + task.id"
                                                value="green" v-model="task.concentrationRating" style="display: none;">
                                            <label :for="'green' + task.id">
                                                <div class="bg-success rounded-circle">
                                                    <div class="bg-success rounded-circle"
                                                        style="width: 1.5rem; height: 1.5rem;"></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-100">
                                <p class="fw-bold">How well did you avoid these distractions?</p>
                                <div v-for="distraction in commonDistractionList" :key="distraction.id">
                                    <div class="d-flex justify-content-center">
                                        <p class="me-auto">{{ distraction.description }}</p>
                                        <div class="form-check">
                                            <input type="radio" :name="'radioGroup' + distraction.id"
                                                :id="'red' + distraction.id" value="red" v-model="distraction.checked"
                                                style="display: none;">
                                            <label :for="'red' + distraction.id">
                                                <div class="bg-danger rounded-circle">
                                                    <div class="bg-danger rounded-circle"
                                                        style="width: 1.5rem; height: 1.5rem;"></div>
                                                </div>
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input type="radio" :name="'radioGroup' + distraction.id"
                                                :id="'amber' + distraction.id" value="amber"
                                                v-model="distraction.checked" style="display: none;">
                                            <label :for="'amber' + distraction.id">
                                                <div class="bg-warning rounded-circle">
                                                    <div class="bg-warning rounded-circle"
                                                        style="width: 1.5rem; height: 1.5rem;"></div>
                                                </div>
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input type="radio" :name="'radioGroup' + distraction.id"
                                                :id="'green' + distraction.id" value="green"
                                                v-model="distraction.checked" style="display: none;">
                                            <label :for="'green' + distraction.id">
                                                <div class="bg-success rounded-circle">
                                                    <div class="bg-success rounded-circle"
                                                        style="width: 1.5rem; height: 1.5rem;"></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <label for="improvementForNextTime" class="fw-bold">What steps do you want to take next time
                                to improve your
                                focus?</label>
                            <input id="improvementForNextTime" v-model="improvement" type="text" class="w-100">

                            <br>
                            <div class="d-flex justify-content-center">
                                <button v-if="this.improvement == ''" type="button" class="btn btn-success w-30 me-3"
                                    disabled>Done</button>
                                <button v-else type="submit" class="btn btn-success w-30 me-3" data-bs-toggle="modal"
                                    data-bs-target="#selfReflectionModal">Done</button>
                                <br>
                                <button type="button" class="btn btn-secondary w-30"
                                    data-bs-dismiss="modal">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>