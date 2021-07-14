<template>
  <div class="p-mt-6 p-flex-column p-jc-center">
    <div class="p-col">
      <img v-if="!imageError" :src="imageURL" @error="imageErrorFlag" style="height: 150px; width: auto"/>
      <img v-else src="../assets/calendar.svg" style="height: 150px; width: auto"/>
    </div>
    <div class="p-col">
      <h1 style="font-size: xxx-large">{{user.firstName}} {{user.lastName}}</h1>
    </div>
    <div class="p-col">
      <span style="font-size: larger">Email: {{user.email }}</span>
    </div>
    <Button class="p-button-lg settings-button p-jc-center" v-on:click="showSettings">
      <i class="pi pi-cog" style="font-size: xx-large"></i>
    </Button>
  </div>
  <Dialog style="width: 500px" :dismissableMask="true" v-model:visible="displaySettings">
    <SettingsDialog v-on:addedImage="resetImage" v-on:removedImage="imageError = true" :user="user"></SettingsDialog>
  </Dialog>
</template>

<script>
import SettingsDialog from "../components/SettingsDialog";
export default {
  name: "Profile",
  components: {SettingsDialog},
  data() {
    return {
      imageError: false,
      displaySettings: false
    }
  },
  methods: {
    imageErrorFlag() {
      this.imageError = true
    },
    showSettings() {
      this.displaySettings = true
    },
    resetImage() {
      this.imageError = true;
      this.imageURL = ''
      setTimeout(() => this.imageError = false, 3000)
    }
  },
  computed: {
    imageURL: function () {
      return `http://localhost:4941/api/v1/users/${this.$store.state.userId}/image`
    },
    user: function () {
      return this.$store.state.userData
    }
  }
}
</script>



<style scoped>
.settings-button {
  width: 80px;
  height: 80px;
  position: fixed;
  top: 6em;
  right: 0;
  margin: 20px;
  z-index: 100;
}
</style>