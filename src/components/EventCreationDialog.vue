<template>
  <div style="align-content: center">
    <h1>Create Event</h1>
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
        <label for="venue" class="p-col-fixed" style="width: 100px">Venue*</label>
        <div class="p-col">
          <InputText :class="venueClass" id="venue" type="text" v-model="venue" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label v-if="isOnline" for="URL" class="p-col-fixed" style="width: 100px">URL*</label>
        <label v-else for="URL" class="p-col-fixed" style="width: 100px">URL</label>
        <div class="p-col">
          <InputText :class="URLclass" id="URL" type="text" v-model="URL" />
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
    <Button class="p-mb-3" label="Create" v-on:click="createEvent"/>
  </div>
</template>
<script>
import EventService from "../services/EventService";

export default {
  name: "eventCreationDialog",
  props: {
    categories: Array
  },
  eventService: null,
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
      image: '',
      titleClass: '',
      categoriesClass: '',
      dateClass: '',
      descriptionClass: '',
      URLclass: '',
      venueClass: '',
      error: ''
    }
  },
  created() {
    this.eventService = new EventService()
    this.minDate = new Date()
  },
  methods: {
    addImage(event){
      this.image = event.files[0]
    },
    clearImage() {
      this.image = ''
    },
    async createEvent() {
      this.titleClass = ''
      this.categoriesClass = ''
      this.dateClass = ''
      this.descriptionClass = ''
      this.URLclass = ''
      this.venueClass = ''
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
        this.URLclass = 'p-invalid'
        this.error = 'Event is online so needs a url'
      } else if (!this.isOnline && this.venue === '') {
        this.venueClass = 'p-invalid'
        this.error = 'A in-person event requires a venue'
      } else {
        let tempCategories = []
        for (let category in this.selectedCategories) {
          tempCategories.push(this.selectedCategories[category].id)
        }


        const data = {
          title: this.title,
          description: this.description,
          categoryIds: tempCategories,
          isOnline: this.isOnline,
          url: this.URL,
          venue: this.venue,
          requiresAttendanceControl: this.requiresAttendanceControl,
          fee: this.fee
        }

        if (this.date !== '') {
          const tempDate = this.date
          const isoStr = tempDate.toISOString().split('T')
          const dateStr = isoStr[0]
          const timeStr = isoStr[1].slice(0, -1)
          console.log(dateStr + timeStr)
          data.date = dateStr + " " + timeStr
        }

        if (this.capacity !== 0) {
          data.capacity = this.capacity
        }

        this.eventService.createEvent(data).then(async (res) => {
          this.$toast.add({severity: 'success', summary: 'Success', detail: 'Successfully Created Event', life: 3000})

          if (this.image !== '') {
            await this.eventService.setEventImage(res.data.eventId, this.image)
          }

          this.eventService.setEventsOrganized()
          this.$emit('close')
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
</script>

<style scoped>

</style>