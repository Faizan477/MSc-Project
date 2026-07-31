<script>
export default
    {
        data() {
            return {
                taskName: '',
                taskDescription: '',
                editedName: '',
                editedDescription: '',
                rescheduleTo: '',
                subtaskEditedName: '',
                subtaskEditedDescription: '',
                listOfTasks: [],
                listOfSubtasks: [],
                progress: 0
            }
        },
        updated() {
            this.tasksProgress()
        },
        mounted() {
            this.tasksProgress()
        },
        computed:
        {
        },
        watch:
        {
            selectedDate() {
                this.fetchTasks()
            }
        },
        props:
            [
                'selectedDate',
                'startDateRange',
                'endDateRange'
            ],
        methods:
        {
            async getCsrfCookie() {
                let csrfCookie = await cookieStore.get('csrftoken')
                console.log(csrfCookie.value.length)
                return csrfCookie.value
            },
            async addTask() {
                const response = await fetch("http://localhost:8000/task_list/",
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() },
                        body: JSON.stringify({ 'taskName': this.taskName, 'taskDescription': this.taskDescription, 'scheduledDate': this.selectedDate })
                    })
                let taskCreated = await response.json()
                console.log(taskCreated)
                if (taskCreated.created != 'true') {
                    alert("An error occured trying to add the task. Please try again later.")
                }
                else {
                    this.fetchTasks()
                }
                this.taskName = ''
                this.taskDescription = ''
            },
            async editTask(task) {
                const response = await fetch("http://localhost:8000/tasks/" + task.id + "/",
                    {
                        method: 'PUT',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() },
                        body: JSON.stringify({ 'taskName': this.editedName, 'taskDescription': this.editedDescription, 'completed': task.completed, 'scheduledDate': this.rescheduleTo })
                    })
                let taskEdited = await response.json()
                if (taskEdited.edited != true) {
                    alert("An error occured trying to edit the task. Please try again later.")
                }
                else {
                    this.fetchTasks()
                }
                this.editedName = ''
                this.editedDescription = ''
                this.rescheduleTo = ''
            },
            async deleteTask(id) {
                const response = await fetch("http://localhost:8000/tasks/" + id + "/",
                    {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() }
                    })
                let taskDeleted = await response.json()
                console.log(taskDeleted)
                if (taskDeleted.deleted != true) {
                    alert("An error occured trying to delete the task. Please try again later.")
                }
                else {
                    this.fetchTasks()
                }
            },
            async fetchTasks() {
                let date = encodeURIComponent(this.selectedDate)
                let response = await fetch("http://localhost:8000/task_list/?date=" + date, { credentials: 'include' })
                this.listOfTasks = await response.json()

                let subtaskResponse = await fetch("http://localhost:8000/subtask_list/?date=" + date, { credentials: 'include' })
                //returns all subtasks for that specific date, regardless of task 
                this.listOfSubtasks = await subtaskResponse.json()
            },
            async addSubtask(task, event) {
                const response = await fetch("http://localhost:8000/subtask_list/",
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() },
                        body: JSON.stringify({ 'task': task.id, 'subtaskName': event.target.elements.subtaskName.value, 'subtaskDescription': event.target.elements.subtaskDescription.value })
                    })
                let subtaskCreated = await response.json()
                console.log(subtaskCreated)
                if (subtaskCreated.created != true) {
                    alert("An error occured trying to add the subtask. Please try again later.")
                }
                else {
                    this.fetchTasks()
                }
                task.subtaskName = ''
                task.subtaskDescription = ''
            },
            async deleteSubtask(id) {
                const response = await fetch("http://localhost:8000/subtasks/" + id + "/",
                    {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() }
                    })
                let subtaskDeleted = await response.json()
                console.log(subtaskDeleted)
                if (subtaskDeleted.deleted != true) {
                    alert("An error occured trying to delete the subtask. Please try again later.")
                }
                else {
                    this.fetchTasks()
                }
            },
            async editSubtask(subtask) {
                const response = await fetch("http://localhost:8000/subtasks/" + subtask.id + "/",
                    {
                        method: 'PUT',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() },
                        body: JSON.stringify({ 'subtaskName': this.subtaskEditedName, 'subtaskDescription': this.subtaskEditedDescription, 'completed': subtask.completed })
                    })
                let subtaskEdited = await response.json()
                if (subtaskEdited.edited != true) {
                    alert("An error occured trying to edit the subtask. Please try again later.")
                }
                else {
                    this.fetchTasks()
                }
            },
            filterSubtasks(id) {
                console.log("list of subtasks:", this.listOfSubtasks);
                let filteredList = []
                for (let subtask of this.listOfSubtasks) {
                    if (subtask.task.id == id) {
                        filteredList.push(subtask)
                    }
                }
                return filteredList
            },
            async completeTask(id) {
                const response = await fetch("http://localhost:8000/task_completed/" + id + "/",
                    {
                        method: 'PUT',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() }
                    })
                let taskCompleted = await response.json()
                console.log(taskCompleted)
                if ((taskCompleted.completed != true) && (taskCompleted.completed != false)) {
                    alert("An error occured. Please try again later.")
                }
                else {
                    this.fetchTasks()
                }
            },
            async completeSubtask(id) {
                const response = await fetch("http://localhost:8000/subtask_completed/" + id + "/",
                    {
                        method: 'PUT',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() }
                    })
                let subtaskCompleted = await response.json()
                console.log(subtaskCompleted)
                if ((subtaskCompleted.completed != true) && (subtaskCompleted.completed != false)) {
                    alert("An error occured. Please try again later.")
                }
                else {
                    this.fetchTasks()
                }
            },
            tasksProgress() {
                let numCompleted = 0
                for (let task of this.listOfTasks) {
                    if (task.completed == true) {
                        numCompleted++
                    }
                }
                if (this.listOfTasks.length == 0) {
                    this.progress = 0
                }
                else {
                    this.progress = (numCompleted / this.listOfTasks.length) * 100
                }
            },
            fetchTaskInfo(task) {
                this.editedName = task.task_name
                this.editedDescription = task.description
                this.rescheduleTo = task.scheduled_date
            },
            fetchSubtaskInfo(subtask) {
                this.subtaskEditedName = subtask.subtask_name
                this.subtaskEditedDescription = subtask.description
            }
        }
    }
</script>
<template>
    <div class="progress w-100">
        <div class="progress-bar" role="progressbar" :style="{ width: progress + '%' }" aria-valuenow="0"
            aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="d-flex justify-content-center">
        <button type="button" id="addTask" class="btn btn-secondary w-50 d-flex justify-content-evenly"
            data-bs-toggle="modal" data-bs-target="#addTaskModal">
            <i class="bi bi-plus-circle-fill" style="font-size: 1.75em;"></i>
            <h6 class="align-self-center">Add new task</h6>
        </button>
    </div>
    <div class="modal fade" id="addTaskModal" role="dialog" aria-labelledby="addTaskModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="addTaskModalLabel">Add a task</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="addTask">
                        <div class="d-flex flex-column align-items-center">
                            <label for="taskName">Task Name</label>
                            <input type="text" id="taskName" class="w-100" v-model="taskName" required>
                            <label for="taskDescription">Description</label>
                            <input type="text" id="taskDescription" class="w-100" v-model="taskDescription">
                            <div class="d-flex justify-content-center mt-3">
                                <button v-if="taskName == ''" type="button" class="btn btn-success w-30"
                                    disabled>Done</button>
                                <button v-else type="submit" class="btn btn-success w-30" data-bs-toggle="modal"
                                    data-bs-target="#addTaskModal">Done</button>
                                <button type="button" class="btn btn-secondary ms-3"
                                    data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div style="overflow:auto;max-height:55vh;">
        <div class="accordion" id="taskAccordion">
            <div v-for="task in listOfTasks" class="accordion-item bg-secondary-subtle" :key="task.id">
                <div class="accordion-header" :id="'header' + task.id">
                    {{ task.task_name }}
                    <div class="me-auto">
                        {{ task.description }}
                    </div>
                    <div id="buttonGroup" class="d-flex justify-content-end">
                        <button type="button" class="bi bi-pencil me-2" data-bs-toggle="modal"
                            :data-bs-target="'#editTaskModal' + task.id" @click="fetchTaskInfo(task)"></button>
                        <button type="button" class="bi bi-trash" @click="deleteTask(task.id)"></button>
                        <button v-if="task.completed" type="button" class="bi bi-check-circle-fill ms-2 me-2"
                            @click="completeTask(task.id)"></button>
                        <button v-else type="button" class="bi bi-circle-fill ms-2 me-2"
                            @click="completeTask(task.id)"></button>
                    </div>
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        v-bind:data-bs-target="'#collapsableBody' + task.id"></button>
                </div>
                <div v-bind:id="'collapsableBody' + task.id" class="accordion-collapse collapse"
                    :aria-labelledby="'header' + task.id" data-bs-parent="#taskAccordion">
                    <div class="accordion-body d-flex flex-column" id="'subtasks'+task.id">
                        <button type="button" id="addSubtask"
                            class="btn btn-secondary w-50 d-flex justify-content-evenly align-self-center"
                            data-bs-toggle="modal" v-bind:data-bs-target="'#addSubtaskModal' + task.id">
                            <i class="bi bi-plus-circle-fill" style="font-size: 1.75em;"></i>
                            <h6 class="align-self-center">Add subtask</h6>
                        </button>
                        <div v-for="subtask in filterSubtasks(task.id)" v-bind:key="subtask.id">
                            <h6>{{ subtask.subtask_name }}
                                <div id="buttonGroup" class="d-flex justify-content-end">
                                    <div class="me-auto">
                                        {{ subtask.description }}
                                    </div>
                                    <button type="button" class="bi bi-pencil me-2" data-bs-toggle="modal"
                                        :data-bs-target="'#editSubtaskModal'+subtask.id" @click="fetchSubtaskInfo(subtask)"></button>
                                    <button type="button" class="bi bi-trash"
                                        @click="deleteSubtask(subtask.id)"></button>
                                    <button v-if="subtask.completed" type="button"
                                        class="bi bi-check-circle-fill ms-2 me-2"
                                        @click="completeSubtask(subtask.id)"></button>
                                    <button v-else type="button" class="bi bi-circle-fill ms-2 me-2"
                                        @click="completeSubtask(subtask.id)"></button>
                                </div>
                            </h6>
                            <div class="modal fade" :id="'editSubtaskModal' + subtask.id" role="dialog"
                                aria-labelledby="editSubtaskModalLabel">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h4 class="modal-title" id="editSubtaskModalLabel">Edit subtask</h4>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form @submit.prevent="editSubtask(subtask)"
                                                class="d-flex flex-column align-items-center">
                                                <label for="editedSubtaskName">Subtask Name</label>
                                                <input type="text" id="editedSubtaskName" class="w-100"
                                                    v-model="subtaskEditedName" required>
                                                <label for="subtaskEditedDescription">Description</label>
                                                <input type="text" id="subtaskEditedDescription" class="w-100"
                                                    v-model="subtaskEditedDescription">
                                                <div class="d-flex justify-content-center mt-3">
                                                    <button v-if="this.subtaskEditedName == ''" type="button"
                                                        class="btn btn-success w-30 me-3" disabled>Done</button>
                                                    <button v-else type="submit" class="btn btn-success w-30 me-3"
                                                        data-bs-toggle="modal"
                                                        :data-bs-target="'#editSubtaskModal' + subtask.id">Done</button>
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

                    </div>
                </div>
                <div class="modal fade" :id="'editTaskModal' + task.id" role="dialog"
                    aria-labelledby="editTaskModalLabel">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="editTaskModalLabel">Edit task</h4>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="close"></button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="editTask(task)" class="d-flex flex-column align-items-center">
                                    <label for="editedTaskName">Task Name</label>
                                    <input type="text" id="editedTaskName" class="w-100" v-model="editedName" required>
                                    <label for="editedDescription">Description</label>
                                    <input type="text" id="editedDescription" class="w-100" v-model="editedDescription">
                                    <label for="rescheduleTo">Scheduled date</label>
                                    <input type="date" id="rescheduleTo" v-model="rescheduleTo" :min="startDateRange"
                                        :max="endDateRange">
                                    <div class="d-flex justify-content-center mt-3">
                                        <button v-if="this.editedName == ''" type="button"
                                            class="btn btn-success w-30 me-3" disabled>Done</button>
                                        <button v-else type="submit" class="btn btn-success w-30 me-3"
                                            data-bs-toggle="modal"
                                            :data-bs-target="'#editTaskModal' + task.id">Done</button>
                                        <br>
                                        <button type="button" class="btn btn-secondary w-30"
                                            data-bs-dismiss="modal">Close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" v-bind:id="'addSubtaskModal' + task.id" role="dialog"
                    aria-labelledby="addSubtaskModalLabel">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="addSubtaskModalLabel">Add a subtask to {{
                                    task.task_name }}</h4>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="close"></button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="addSubtask(task, $event)">
                                    <div class="d-flex flex-column align-items-center">
                                        <label for="subtaskName">Subtask Name</label>
                                        <input type="text" id="subtaskName" class="w-100" v-model="task.subtaskName"
                                            required>
                                        <label for="subtaskDescription">Description</label>
                                        <input type="text" class="w-100" id="subtaskDescription"
                                            v-model="task.subtaskDescription">
                                        <div class="d-flex justify-content-center mt-3">
                                            <button v-if="task.subtaskName == ''" type="submit"
                                                class="btn btn-success w-30 me-3" disabled>Done</button>
                                            <button v-else type="submit" class="btn btn-success w-30 me-3"
                                                data-bs-dismiss="modal">Done</button>
                                            <button type="button" class="btn btn-secondary w-30 me-3"
                                                data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>