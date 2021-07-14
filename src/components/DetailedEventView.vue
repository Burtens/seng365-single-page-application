<template>
  <TabView @tab-change="getAttendees">
    <TabPanel header="Event">
      <div class="p-grid p-fluid p-ai-center vertical-container">
        <div class="p-col-4">
          <img v-if="!eventImageError" :src="eventImageURL" @error="eventImageErrorFlag" style="height: auto; width: 240px" />
          <img v-else src="../assets/calendar.svg" style="height: auto; width: 240px" />
        </div>
        <div class="p-col-8">
          <h2 class="p-ml-4">{{event.title}}</h2>
          <div class="p-grid p-ml-2">
            <div class="p-col-1 p-mr-3">
              <img v-if="!organizerImageError" :src="organizerImageURL" @error="organizerImageErrorFlag" style="height: 50px; width: 50px"/>
              <img v-else src="../assets/user.svg" style="height: 50px; width: 50px" />
            </div>
            <div class="p-col-5">
              <h5>Organizer: {{event.organizerFirstName}} {{event.organizerLastName}}</h5>
            </div>
          </div>
          <div class="p-grid p-jc-start p-ml-4">
            <div class="p-col-1">
              <i class="pi pi-clock p-mr-2"/>
            </div>
            <div class="p-col-8">
              <span class="p-mr-5">Date: {{date}}</span>
              <span>Time: {{time}}</span>
            </div>
          </div>
          <div class="p-grid p-jc-start p-ml-4">
            <div class="p-col-1">
              <i class="pi pi-users p-mr-2"/>
            </div>
            <div class="p-col-8">
              <span class="p-mr-5">Attendees: {{event.attendeeCount !== null ? event.attendeeCount : 0}}</span>
              <span v-if="event.capacity != null">Capacity: {{event.capacity}}</span>
            </div>
          </div>
          <div class="p-grid p-jc-start p-ml-4" v-if="event.venue != null">
            <div class="p-col-1">
              <i class="pi pi-map p-mr-2"/>
            </div>
            <div class="p-col-8">
              <span class="p-mr-5">Venue: {{event.venue}}</span>
            </div>
          </div>
          <div v-if="event.url != null" class="p-grid p-jc-start p-ml-4">
            <div class="p-col-1">
              <i class="pi pi-globe p-mr-2"/>
            </div>
            <div class="p-col-8">
              <span class="p-mr-5">URL: <a :href="event.url">{{event.url}}</a></span>
            </div>
          </div>
          <div class="p-grid p-jc-start p-ml-4">
            <div class="p-col-1">
              <i class="pi pi-dollar p-mr-2"/>
            </div>
            <div class="p-col-8">
              <span class="p-mr-5">Price: {{event.fee != '0.00' ? "$" + event.fee : "free" }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="p-d-flex p-ai-center p-flex-column p-flex-sm-row">
        <Chip class="p-text-nowrap p-text-truncate"
              style="font-size: small; margin: 5px" v-for="id in event.categories"
              :key="id" :label="categories.find(x => x.id === id).name"/>
      </div>
      <Fieldset legend="Description">
          {{event.description}}
      </Fieldset>
      <Carousel class="p-align-center" v-if="relatedEvents.length !== 0" :value="relatedEvents" :numVisible="relatedEventsVisible" :numScroll="1">
        <template #item="slotProps">
          <SearchResult :event="slotProps.data" :categories="categories"></SearchResult>
        </template>
      </Carousel>
    </TabPanel>
    <TabPanel header="Attendees" >
      <div class="p-flex-column p-jc-center">
          <AttendeeCard v-for="attendee in eventAttendees"
                        :key="attendee.attendeeId"
                        :user="attendee"
                        v-on:changeStatus="controlAttendance($event, attendee.attendeeId)"
                        :is-organiser="attendee.attendeeId === event.organizerId"
                        :organiser-viewing="$store.state.userId === event.organizerId" ></AttendeeCard>
      </div>
    </TabPanel>
  </TabView>
</template>

<script>
import UserService from "../services/UserService";
import EventService from "../services/EventService";
import AttendeeCard from "./AttendeeCard";
import SearchResult from "./SearchResult";

export default {
  name: "DetailedEventView",
  components: {AttendeeCard, SearchResult},
  props: {
    event: Object,
    relatedEvents: Array,
    categories: Array
  },
  data() {
    return {
      eventImageURL: `http://localhost:4941/api/v1/events/${this.event.id}/image`,
      eventImageError: false,
      organizerImageURL: `http://localhost:4941/api/v1/users/${this.event.organizerId}/image`,
      organizerImageError: false,
      eventAttendees: []
    }
  },
  userService: null,
  eventService: null,
  created() {
    this.userService = new UserService()
    this.eventService = new EventService()
  },
  methods: {
    eventImageErrorFlag() {
      this.eventImageError = true
    },
    organizerImageErrorFlag() {
      this.organizerImageError = true
    },
    getAttendees(tabEvent) {
      if (tabEvent.index === 1) {
        this.eventService.getEventAttendees(this.event.id).then(data => {
            this.eventAttendees = data
      })
      }
    },
    async controlAttendance(status, userId) {
      await this.eventService.setAttendanceStatus(status, this.event.id, userId).catch(err => {
        if (err.response) {
          this.$toast.add({severity: 'error', summary: 'Error', detail: err.response.statusText, life: 3000})
        } else {
          console.log(err)
        }
      })
    },
  },
  computed: {
    date: function() {
      return this.event.date.split('T')[0]
    },
    time: function() {
      return this.event.date.split('T')[1].substring(0,5)
    },
    relatedEventsVisible: function () {
      return this.relatedEvents.length < 3 ? this.relatedEvents.length : 3
    },
  }
}
</script>

<style scoped>

</style>