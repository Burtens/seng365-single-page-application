<template>
  <div style="align-content: center">
    <h1>Edit Details</h1>
  </div>
  <div>
    <div class="p-fluid p-align-center">
      <div class="p-field p-grid">
        <label for="title" class="p-col-fixed" style="width: 100px">Title*</label>
        <div class="p-col">
          <InputText id="title" type="text" v-model="title" :class="titleClass"/>
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="categorySelector" class="p-col-fixed" style="width: 100px">Select Categories*</label>
        <div class="p-col p-jc-center">
          <MultiSelect :class="categoriesClass" id="categorySelector" style="width: 150px" v-model="selectedCategories" :options="categories" optionLabel="name" placeholder="Categories">
            <template #option="slotProps">
              <span>{{slotProps.option.name}}</span>
            </template>
          </MultiSelect>
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="dateSelector" class="p-col-fixed" style="width: 100px">Event Date*</label>
        <div class="p-col">
          <Calender :class="dateClass" id="dateSelector" v-model="date" :showTime="true" :manualInput="false" :minDate="minDate" dateFormat="yy-mm-dd" ></Calender>
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="maxCapacity" class="p-col-fixed" style="width: 100px">Max Capacity</label>
        <div class="p-col">
          <InputNumber v-model="capacity" mode="decimal" showButtons :min="0" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="onlineSelector" class="p-col-fixed" style="width: 100px">Is Online</label>
        <div class="p-col">
          <InputSwitch id="onlineSelector" v-model="isOnline"/>
        </div>
      </div>
      <div v-if="!isOnline" class="p-field p-grid">
        <label for="venue" class="p-col-fixed" style="width: 100px">Venue</label>
        <div class="p-col">
          <InputText :class="venueClass" id="venue" type="text" v-model="venue" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="URL" class="p-col-fixed" style="width: 100px">URL</label>
        <div class="p-col">
          <InputText :class="URLClass" id="URL" type="text" v-model="URL" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="attendanceControl" class="p-col-fixed" style="width: 100px">Attendance Controlled</label>
        <div class="p-col">
          <InputSwitch id="attendanceControl" v-model="requiresAttendanceControl"/>
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="fee" class="p-col-fixed" style="width: 100px">Cost</label>
        <div class="p-col">
          <InputNumber id="fee" v-model="fee" mode="currency" currency="NZD" showButtons :min="0" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="description" class="p-col-fixed" style="width: 100px">Description*</label>
        <div class="p-col">
          <Textarea :class="descriptionClass" id="description" v-model="description" :autoResize="true" rows="5" cols="30" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="imageUploader" class="p-col-fixed" style="width: 100px">Upload Image</label>
        <div class="p-col">
          <FileUpload id="imageUploader"
                      :fileLimit="1"
                      :showUploadButton="false"
                      :auto="true"
                      :customUpload="true"
                      @clear="clearImage"
                      @uploader="addImage" name="demo[]" accept=".jpeg, .png, .gif, .jpg"></FileUpload>
        </div>
      </div>
    </div>
  </div>
  <Divider align="center">
    <div class="p-d-inline-flex p-ai-center">
      <InlineMessage v-if="error !== ''" v-text="error" ></InlineMessage>
    </div>
  </Divider>
  <div class="p-fluid p-jc-center p-mt-2">
    <Button class="p-mb-3" label="Make Changes" v-on:click="makeChanges"/>
  </div>
</template>

<script>
import EventService from "../services/EventService";

export default {
  name: "EventEditDialog",
  props: {
    event: Object,
    categories: Array
  },
  data() {
    return {
      title: '',
      date: '',
      description: '',
      capacity: 0,
      isOnline: false,
      URL: '',
      venue: '',
      requiresAttendanceControl: false,
      fee: 0,
      minDate: null,
      selectedCategories: [],
      oldTitle: '',
      oldDate: '',
      oldDescription: '',
      oldCapacity: 0,
      oldIsOnline: false,
      oldURL: '',
      oldVenue: '',
      oldRequiresAttendanceControl: false,
      oldFee: 0,
      oldSelectedCategories: [],
      image: '',
      titleClass: '',
      categoriesClass: '',
      dateClass: '',
      descriptionClass: '',
      URLClass: '',
      venueClass: '',
      error: ''
    }
  },
  eventService: null,
  created() {
    this.eventService = new EventService()
    this.minDate = new Date()

    let tempCategories = []

    for (let category in this.event.categories) {
      console.log(this.categories)
      console.log(this.event.categories[category])
      tempCategories.push(this.categories.find(x => x.id === this.event.categories[category]))

      console.log(this.categories.find(x => x.id === this.event.categories[category]))
    }


    const date = this.event.date.split('T')[0]
    const time = this.event.date.split('T')[1]
    const dateTime = date + ' ' + time.slice(0, 5)

    this.title = this.event.title
    this.date = dateTime
    this.description = this.event.description
    this.capacity = this.event.capacity !== null ? this.event.capacity : 0
    this.isOnline = this.event.isOnline
    this.URL = this.event.url
    this.venue = this.event.venue
    this.requiresAttendanceControl = this.event.requiresAttendanceControl
    this.fee = this.event.fee
    this.selectedCategories = tempCategories

    this.oldTitle = this.event.title
    this.oldDate = dateTime
    this.oldDescription = this.event.description
    this.oldCapacity = this.event.capacity !== null ? this.event.capacity : 0
    this.oldIsOnline = this.event.isOnline
    this.oldURL = this.event.url
    this.oldVenue = this.event.venue
    this.oldRequiresAttendanceControl = this.event.requiresAttendanceControl
    this.oldFee = this.event.fee
    this.oldSelectedCategories = tempCategories
  },
  methods: {
    makeChanges() {
      if (this.title === '') {
        this.titleClass = 'p-invalid'
        this.error = "A Title is Required"
      } else if (this.selectedCategories.length === 0) {
        this.categoriesClass = 'p-invalid'
        this.error = 'At least one category must be selected'
      } else if (this.date === '') {
        this.dateClass = 'p-invalid'
        this.error = 'Please Select a Date'
      } else if (this.description === '') {
        this.descriptionClass = 'p-invalid'
        this.error = 'Please provide a description'
      } else if (this.isOnline && this.URL === '') {
        this.URLClass = 'p-invalid'
        this.error = 'Event is online so needs a url'
      } else if (!this.isOnline && this.venue === '') {
        this.venueClass = 'p-invalid'
        this.error = 'A in-person event requires a venue'
      } else {

        let changed = false

        let event = {}

        if(this.title !== this.oldTitle) {
          changed = true
          event.title = this.title
        }

        if(this.date !== this.oldDate) {
          changed = true
          event.date = this.date
        }

        if(this.description !== this.oldDescription) {
          changed = true
          event.description = this.description
        }

        if(this.capacity !== this.oldCapacity) {
          changed = true
          event.capacity = this.capacity
        }

        if(this.isOnline !== this.oldIsOnline) {
          changed = true
          event.isOnline = this.isOnline
        }

        if(this.URL !== this.oldURL){
          changed = true
          event.url = this.URL
        }

        if(this.venue !== this.oldVenue) {
          changed = true
          event.venue = this.venue
        }

        if(this.requiresAttendanceControl !== this.oldRequiresAttendanceControl) {
          changed = true
          event.requiresAttendanceControl = this.requiresAttendanceControl
        }

        if(this.fee !== this.oldFee) {
          changed = true
          event.fee = this.fee
        }

        if(this.selectedCategories !== this.oldSelectedCategories) {
          changed = true

          let tempCategories = []
          for (let category in this.selectedCategories) {
            tempCategories.push(this.selectedCategories[category].id)
          }
          event.categoryIds = tempCategories
        }

        if (!changed) {
          this.$toast.add({severity: 'info', summary: 'Info', detail: 'No Changes Made', life: 3000})
        } else {
          this.eventService.editEvent(this.event.id, event).then(() => {
            this.$toast.add({severity: 'success', summary: 'Updated', detail: 'Changes Made', life: 3000})
            this.eventService.setEventsOrganized()
            this.eventService.setEventsAttending()
          }).catch(err => {
            if (err.response) {
              this.$toast.add({severity: 'error', summary: 'Error', detail: err.response.statusText, life: 3000})
            } else {
              console.log(err)
            }
          })

        }
      }

    }
  }
}
</script>

<style scoped>

</style>