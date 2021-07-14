<template>
  <Card style="width: 30rem; margin-bottom: 2em; height: 100px">
    <template #title>
      <div class="p-grid p-ai-center vertical-container">
        <div class="p-col-2 p-mr-5">
          <img v-if="!userImageError" :src="userImageURL" @error="userImageErrorFlag" style="height: 50px; width: auto" />
          <img v-else-if="userImageError" src="../assets/user.svg" style="height: 50px; width: auto" />
        </div>
        <div class="p-grid">
          <div class="p-col-fixed" style="width: 275px">
            <span>{{user.firstName}} {{user.lastName}}</span>
            <div>
              <Chip style="height: 20px; font-size: small; background: limegreen" v-if="isOrganiser" label="Organiser"></Chip>
              <Chip style="height: 20px;  font-size: small" v-else label="Attendee"></Chip>

              <Chip style="height: 20px;  font-size: small"
                    v-if="user.attendeeId === $store.state.userId || organiserViewing"
                    class="p-ml-2"
                    :label=attendanceStatus></Chip>
            </div>
          </div>
          <div class="p-col-1">
            <div v-if="attendanceStatus !== 'accepted' && attendanceStatus !== 'rejected' && organiserViewing">
              <Button v-on:click="changeAttendance('accepted')" v-tooltip="'Accept'" class="p-button-outlined p-button-rounded p-button-success p-mb-1" icon="pi pi-check"></Button>
              <Button v-on:click="changeAttendance('rejected')" v-tooltip="'Reject'" class="p-button-outlined p-button-rounded p-button-danger p-mt-1" icon="pi pi-times"></Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  name: "AttendeeCard",
  props: {
    user: Object,
    isOrganiser: Boolean,
    organiserViewing: Boolean
  },
  data() {
    return {
      attendanceStatus: '',
      userImageError: false,
      userImageURL: `http://localhost:4941/api/v1/users/${this.user.attendeeId}/image`
    }
  },
  created() {
    this.attendanceStatus = this.user.status
  },
  watch: {
    userImageURL: function () {
      this.userImageError = false
    },
  },
  methods: {
    userImageErrorFlag() {
      this.userImageError = true
    },
    changeAttendance(status) {
      this.attendanceStatus = status
      this.$emit('changeStatus', status)
    }
  },
}
</script>

<style scoped>

</style>