<template>
  <Card style="margin: 20px; height: 400px; width: 300px">
    <template #header>
      <div class="p-grid p-jc-center">
        <img v-if="!imageError" :src="imageURL" @error="imageErrorFlag" style="height: 150px; width: auto"/>
        <img v-else src="../assets/calendar.svg" style="height: 150px; width: auto"/>
      </div>
    </template>
    <template #title>
      {{event.title}}
    </template>
    <template #content>
      <div class="p-d-flex p-ai-center p-flex-column p-flex-sm-row">
        <Chip class="p-text-nowrap p-text-truncate"
              style="font-size: small; margin: 5px" v-for="id in event.categories"
              :key="id" :label="categories.find(x => x.id === id).name"
              v-tooltip.bottom="categories.find(x => x.id === id).name" />
      </div>
      <div class="p-grid">
        <div class="p-col-12">
            Organiser: {{event.organizerFirstName}} {{event.organizerLastName}}
        </div>
        <div class="p-col-12">
          Attendees: {{event.numAcceptedAttendees}}
        </div>
        <div class="p-col-6">
          Date: {{event.date.split('T')[0]}}
        </div>
        <div class="p-col-6">
          Time: {{ event.date.split('T')[1].substring(0,5)}}
        </div>


      </div>
    </template>
  </Card>
</template>

<script>

export default {
  name: "SearchResult",
  props: {
    event: Object,
    categories: Array
  },
  data() {
    return {
      imageError: false
    }
  },
  methods: {
    imageErrorFlag() {
      this.imageError = true
    }
  },
  computed: {
    imageURL: function () {
      return `http://localhost:4941/api/v1/events/${this.event.eventId}/image`
    }
  }
}
</script>

<style scoped>

</style>