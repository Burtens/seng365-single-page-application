<template>
  <DataView class="p-mt-3" style="width: 75%" layout="grid" :value="events" :totalRecords="totalEvents"
            :paginator="true" :rows="10" :lazy="true" @page="onPage"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
    <template #header>
      <div>
        <Card>
          <template #content>
            <div class="p-grid p-jc-center">
              <div class="p-col-fixed">
                <Button icon="pi pi-search" class="p-ripple p-button-outlined p-button-rounded" v-on:click="search"/>
              </div>
              <div class="p-col-fixed">
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By" @change="onSortChange"/>
              </div>
              <div class="p-col-fixed">
                <MultiSelect style="width: 150px" v-model="selectedCategories" :options="categories" optionLabel="name" placeholder="Categories">
                  <template #option="slotProps">
                      <span>{{slotProps.option.name}}</span>
                  </template>
                </MultiSelect>
              </div>
              <div class="p-col-fixed">
                <InputText v-model="searchQuery" v-on:keyup.enter="search"/>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </template>
    <template #empty>No Records Found.</template>
    <template #grid="slotProps">
      <div class="p-grid p-jc-evenly">
        <div class="p-col-12 p-md-10">
          <SearchResult class="search" v-on:click="viewDetails(slotProps.data.eventId)" :event="slotProps.data" :categories="categories"></SearchResult>
        </div>
      </div>
    </template>
  </DataView>
  <Dialog :dismissableMask="true" :modal="true" v-model:visible="displayDetails">
    <DetailedEventView :event="detailedEvent" :categories="categories" :relatedEvents="relatedEvents" style="width: 850px; height: 500px" />
    <template #footer v-if="eventAttendValid">
      <Button class="p-mt-2" v-if="$store.state.validationToken !== ''" label="Request Attendance" v-on:click="requestAttendance"></Button>
      <Button class="p-mt-2" v-else v-tooltip.bottom="'Please Login or Register to Request Attendance'" label="Request Attendance"></Button>
    </template>
  </Dialog>
</template>

<script>
import EventService from "../services/EventService";
import SearchResult from "../components/SearchResult";
import DetailedEventView from "../components/DetailedEventView";

export default {
  name: "Search",
  components: {DetailedEventView, SearchResult},
  data() {
    return {
      searchQuery: '',
      selectedCategories: null,
      categories: null,
      sortKey: {label: "Date ASC", value: "DATE_ASC"},
      sortOptions: [
        {label: "Date ASC", value: "DATE_ASC"},
        {label: "Date DESC", value: "DATE_DESC"},
        {label: "Attendees ASC", value: "ATTENDEES_ASC"},
        {label: "Attendees DESC", value: "ATTENDEES_DESC"}
      ],
      events: null,
      totalEvents: null,
      displayDetails: false,
      detailedEvent: null,
      relatedEvents: null
    }
  },
  eventService: null,
  created() {
    this.eventService = new EventService()
  },
  mounted() {
    this.eventService.getCategories().then(data => {
      this.categories = data
    })
  },
  computed: {
    eventAttendValid: function () {
      if (this.detailedEvent) {
        return (Date.parse(this.detailedEvent.date) > Date.now())
            && (this.detailedEvent.attendeeCount < this.detailedEvent.capacity
            || this.detailedEvent.capacity === null)
      } else {
        return false
      }
    },
  },
  methods: {
    onPage(event) {
      this.eventService.getEvents(event.first,  event.rows, this.searchQuery, this.selectedCategories, this.sortKey.value).then(data => {
        this.events = data
      })
    },
    onSortChange() {
      this.search()
    },
    search() {
      this.eventService.getEvents(0,10, this.searchQuery, this.selectedCategories, this.sortKey.value).then(data => {
        this.events = data
        this.totalEvents = data.length
      })
    },
    requestAttendance() {
      this.eventService.requestAttendance(this.detailedEvent.id).then(() => {
        this.$toast.add({severity: 'success', summary: 'Success', detail: 'Successfully Registered', life: 3000})
      }).catch(err => {
        if (err.response) {
          if (err.response.status === 500) {
            this.$toast.add({severity: 'error', summary: 'Error', detail: err.response.statusText, life: 3000})
          } else {
            this.$toast.add({severity: 'warn', summary: 'Alert', detail: err.response.statusText, life: 3000})
          }
        } else {
          console.log(err)
        }
      })
    },
    viewDetails(eventId) {
      this.eventService.getEvent(eventId).then(data => {
        this.detailedEvent = data
        this.eventService.getRelatedEvents(this.detailedEvent.categories).then(data => {
          let temp = []

          for (let event in data) {
            if (data[event].eventId !== this.detailedEvent.id) {
              temp.push(data[event])
            }
          }
          this.relatedEvents = temp
        }).then(() => {
              this.displayDetails = true
        })
      })
    }
  }
}
</script>

<style scoped>
.search:hover {
  background-color: #eee;
  cursor: pointer;
}


</style>