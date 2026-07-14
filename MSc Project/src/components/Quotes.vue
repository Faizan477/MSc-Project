<script>
export default
    {
        data() {
            return {
                quoteText: '',
                quoteAuthor: '',
                listOfQuotes: [],
            }
        },
        methods:
        {
            async getCsrfCookie() {
                let csrfCookie = await cookieStore.get('csrftoken')
                console.log(csrfCookie.value.length)
                return csrfCookie.value
            },
            async addQuote() {
                const response = await fetch("http://localhost:8000/quote_list/",
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() },
                        body: JSON.stringify({ 'text': this.quoteText, 'author': this.quoteAuthor })
                    })
                let quoteCreated = await response.json()
                if (quoteCreated.created != 'true') {
                    alert("An error occured trying to add the quote. Please try again later.")
                }
                else {
                    this.fetchQuotes()
                }
                this.quoteText = ''
                this.quoteAuthor = ''
            },
            async deleteQuote(id) {
                const response = await fetch("http://localhost:8000/quote/" + id + "/",
                    {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: { 'X-CSRFToken': await this.getCsrfCookie() }
                    })
                let quoteDeleted = await response.json()
                if (quoteDeleted.deleted != true) {
                    alert("An error occured trying to delete the quote. Please try again later.")
                }
                else {
                    this.fetchQuotes()
                }
            },
            async fetchQuotes() {
                let response = await fetch("http://localhost:8000/quote_list/", { credentials: 'include' })
                this.listOfQuotes = await response.json()
            }
        },
        created()
        {
            this.fetchQuotes()
        }
    }
</script>
<template>
    <div class="d-flex flex-column align-items-center">
        <h4 class="align-self-start">Quotes</h4>
    </div>
    <div class="d-flex justify-content-center">
        <button type="button" id="addQuote" class="btn btn-secondary w-50 d-flex justify-content-evenly" data-bs-toggle="modal"
        data-bs-target="#addQuoteModal">
        <i class="bi bi-plus-circle-fill" style="font-size: 1.75em;"></i>
        <h6 class="align-self-center">Add new quote</h6>
    </button>
    </div>
    <div class="modal fade" id="addQuoteModal" role="dialog" aria-labelledby="addQuoteModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="addQuoteModalLabel">Add a motivational quote</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="addQuote" class="d-flex flex-column align-items-center">
                        <label for="quoteText">Quote Text</label>
                        <input type="text" id="quoteText" class="w-100" v-model="quoteText" required>
                        <label for="quoteAuthor">Quote Author</label>
                        <input type="text" id="quoteAuthor" class="w-100" v-model="quoteAuthor">
                        <br>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn btn-success w-30 me-3" data-bs-toggle="modal"
                            data-bs-target="#addQuoteModal">Done</button>
                        <br>
                        <button type="button" class="btn btn-secondary w-30" data-bs-dismiss="modal">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div style="overflow:auto;max-height:55vh;">
        <div v-for="quote in listOfQuotes" v-bind:key="quote.id">
            <div>
                <div class="d-flex flex-column">
                    <p class="mb-0">"{{ quote.text }}"</p>
                    <div class="d-flex justify-content-end">
                    <button type="button" class="bi bi-pencil me-2"></button>
                    <button type="button" class="bi bi-trash" @click="deleteQuote(quote.id)"></button>
                    <p class="mt-0 ms-auto">-{{ quote.author }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>