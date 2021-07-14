<template>
  <div>
    <Button class="p-mt-5" label="Create New Event" v-on:click="showCreateEvent"></Button>
    <Divider align="center">
      <div class="p-d-inline-flex p-ai-center">
        <b>Attending</b>
      </div>
    </Divider>
    <Carousel class="p-align-center" style="width: 1150px" v-if="eventsAttending.length !== 0" :value="eventsAttending" :numVisible="eventsAttendingVisible" :numScroll="1">
      <template #item="slotProps">
        <SearchResult :event="slotProps.data" :categories="categories"></SearchResult>
        <Button class="p-button-danger" v-if="Date.parse(slotProps.data.date) > Date.now()"  label="Cancel Attendance" v-on:click="removeAttendance(slotProps.data.eventId)"></Button>
      </template>
    </Carousel>
    <h4 v-else>No Events Attending</h4>
    <Divider align="center">
      <div class="p-d-inline-flex p-ai-center">
        <b>Organising</b>
      </div>
    </Divider>
    <Carousel class="p-align-center" style="width: 1150px;" v-if="eventsOrganizing.length !== 0" :value="eventsOrganizing" :numVisible="eventsOrganizingVisible" :numScroll="1">
      <template #item="slotProps">
        <SearchResult class="search" v-on:click="showDetails(slotProps.data.eventId)" :event="slotProps.data" :categories="categories"></SearchResult>
        <div class="p-grid p-jc-center">
          <div class="p-col-4">
            <Button style="width: 80px"  label="Edit" v-on:click="editEvent(slotProps.data.eventId)"></Button>
          </div>
          <div class="p-col-4">
            <Button class="p-button-danger" style="width: 80px"  label="Delete" v-on:click="deleteEvent(slotProps.data.eventId)"></Button>
          </div>
        </div>
      </template>
    </Carousel>
    <h4 v-else>No Events Organizing</h4>
    <Dialog style="width: 600px"  :dismissableMask="true" v-model:visible="makingEvent">
      <EventCreationDialog v-on:close="closeCreateEvent" :categories="categories"></EventCreationDialog>
    </Dialog>
    <Dialog style="width: 600px"  :dismissableMask="true" v-model:visible="editingEvent">
      <EventEditDialog v-on:close="closeEditEvent" :event="selectedEvent" :categories="categories"></EventEditDialog>
    </Dialog>
    <Dialog :modal="true"  :dismissableMask="true" v-model:visible="viewingDetails">
      <DetailedEventView :relatedEvents="relatedEvents" :event="selectedEvent" :categories="categories" style="width: 850px; height: 500px"></DetailedEventView>
    </Dialog>
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>

<script>
import EventCreationDialog from "../components/EventCreationDialog";
import SearchResult from "../components/SearchResult";
import EventService from "../services/EventService";
import EventEditDialog from "../components/EventEditDialog";
import DetailedEventView from "../components/DetailedEventView";

export default {
  name: "Events",
  components: {DetailedEventView, EventEditDialog, EventCreationDialog, SearchResult},
  eventService: null,
  async created() {
    this.eventService = new EventService()
  },
  data() {
    return {
      makingEvent: false,
      editingEvent: false,
      viewingDetails: false,
      categories: this.$store.state.categories,
      selectedEvent: '',
      relatedEvents: []
    }
  },
  methods: {
    showCreateEvent() {
      this.makingEvent = true
    },
    closeCreateEvent() {
      this.makingEvent = false
    },
    closeEditEvent() {
      this.editingEvent = false
    },
    deleteEvent(eventId) {
      this.$confirm.require({
        message: 'Are you sure you want to delete this event?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.eventService.deleteEvent(eventId).then(() => {
            this.eventService.setEventsOrganized()
            this.eventService.setEventsAttending()
          }).catch(err => {
            if (err.response) {
              this.$toast.add({severity: 'warn', summary: 'Error', detail: err.response.statusText, life: 3000})
            }
          })
        }
      })
    },
    editEvent(eventId) {
      this.eventService.getEvent(eventId).then(data => {
        this.selectedEvent = data
        this.editingEvent = true
      })
    },
    removeAttendance(eventId) {
      this.$confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.eventService.removeAttendance(eventId).then(() => {
            this.eventService.setEventsAttending()
          }).catch(err => {
            if (err.response) {
              this.$toast.add({severity: 'warn', summary: 'Error', detail: err.response.statusText, life: 3000})
            }
          })
        }
      })
    },
    showDetails(eventId) {
      this.eventService.getEvent(eventId).then(data => {
        this.selectedEvent = data
        this.eventService.getRelatedEvents(this.selectedEvent.categories).then(data => {
          let temp = []

          for (let event in data) {
            if (data[event].eventId !== this.selectedEvent.id) {
              temp.push(data[event])
            }
          }
          this.relatedEvents = temp
        }).then(() => {
          this.viewingDetails = true
        })
      })
    }
  },
  computed: {
    eventsOrganizing: function () {
      return this.$store.state.userEventsOrganized
    },
    eventsOrganizingVisible: function () {
      return this.eventsOrganizing.length < 3 ? this.eventsOrganizing.length : 3
    },
    eventsAttending: function () {
      return this.$store.state.userEventsAttending
    },
    eventsAttendingVisible: function () {
      return this.eventsAttending.length < 3 ? this.eventsAttending.length : 3
    },
  }
}
</script>

<style scoped>
.search:hover {
  background-color: #eee;
  cursor: pointer;
}
</style>