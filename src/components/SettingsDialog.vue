<template>
  <div style="align-content: center">
    <h1>Edit Details</h1>
  </div>
  <div>
    <div class="p-fluid p-align-center">
      <div class="p-field p-grid">
        <label for="fname" class="p-col-fixed" style="width: 100px">First Name</label>
        <div class="p-col">
          <InputText id="fname" type="text" v-model="firstName" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="lname" class="p-col-fixed" style="width: 100px">Last Name</label>
        <div class="p-col">
          <InputText id="lname" type="text" v-model="lastName" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="email" class="p-col-fixed" style="width: 100px">Email</label>
        <div class="p-col">
          <InputText id="email" type="text" v-model="email" />
        </div>
      </div>
      <Divider align="center">
        <div class="p-d-inline-flex p-ai-center">
          <b>Change Password</b>
        </div>
      </Divider>
      <div class="p-field p-grid">
        <label for="newPassword" class="p-col-fixed" style="width: 100px">New Password</label>
        <div class="p-col">
          <InputText id="newPassword" type="password" v-model="newPassword"/>
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="oldPassword" class="p-col-fixed" style="width: 100px">Current Password</label>
        <div class="p-col">
          <InputText id="oldPassword" type="password" v-model="oldPassword"/>
        </div>
      </div>
    </div>
  </div>
  <Divider align="center">
    <div class="p-d-inline-flex p-ai-center">
      <b>Change Profile Image</b>
    </div>
  </Divider>
  <div class="p-col">
  <FileUpload :fileLimit="1"
              :showUploadButton="false"
              :auto="true"
              :customUpload="true"
              @clear="clearImage"
              @uploader="changeImage" name="demo[]" accept=".jpeg, .png, .gif, .jpg"></FileUpload>
  </div>
  <div class="p-fluid">
    <Button class="p-button-danger" label="Remove Profile Image" v-on:click="deleteImage"></Button>
  </div>
  <hr class="solid p-mt-4 p-mb-3">
  <div class="p-fluid p-jc-center p-mt-2">
    <Button label="Make Changes" v-on:click="submitChanges"/>
  </div>
</template>

<script>
import UserService from "../services/UserService";

export default {
  name: "SettingsDialog",
  props: {
    user: Object
  },
  userService: null,
  data() {
    return {
      firstName: '',
      initialFirstName: '',
      lastName: '',
      initialLastName: '',
      email: '',
      initialEmail: '',
      oldPassword: '',
      newPassword: '',
      image: '',
    }
  },
  created() {
    this.userService = new UserService()
    this.firstName = this.user.firstName
    this.lastName = this.user.lastName
    this.email = this.user.email
    this.initialFirstName = this.user.firstName
    this.initialLastName = this.user.lastName
    this.initialEmail = this.user.email
  },
  methods: {
    changeImage(event) {
      this.image = event.files[0]
    },
    deleteImage() {
      this.userService.deleteImage(this.$store.state.userId).then(() => {
        this.$toast.add({severity: 'success', summary: 'Success', detail: 'Image Successfully Deleted', life: 3000})
        this.$emit('removedImage')
      }).catch((err) => {
        if (err.response) {
          const message = err.response.status === 404 ? "No Image to Remove" : err.response.statusText
          this.$toast.add({severity: 'error', summary: 'Error', detail: message, life: 3000})
        } else {
          console.log(err)
        }
      })
    },
    clearImage() {
      this.image = ''
    },
    submitChanges() {
      let changes = false
      if (this.image !== '') {
        changes = true
        this.userService.setImage(this.image, this.$store.state.userId).then(() => {
          this.$toast.add({severity: 'success', summary: 'Success', detail: 'Image Successfully Uploaded', life: 3000})
          this.$emit('addedImage')
        }).catch((err) => {
          this.$toast.add({severity: 'error', summary: 'Error', detail: err, life: 3000})
        })
      }

      if (this.firstName !== this.initialFirstName ||
          this.lastName !== this.initialLastName ||
          this.email !== this.initialEmail ||
          this.newPassword !== '') {

        changes = true

        let data = {}

        if (this.firstName !== this.initialFirstName) {
          data.firstName = this.firstName
        }

        if (this.lastName !== this.initialLastName) {
          data.lastName = this.lastName
        }

        if (this.email !== this.initialEmail) {
          data.email = this.email
        }

        if (this.newPassword !== '') {
          if (this.newPassword.length < 8) {
            this.$toast.add({severity: 'error', summary: 'Error', detail: "Passwords must be at least 8 characters", life: 3000})
            return
          } else {
            data.password = this.newPassword
            data.currentPassword = this.oldPassword
          }
        }

        this.userService.updateDetails(data, this.$store.state.userId).then(() => {
              this.userService.getUser(this.$store.state.userId).then(data => {
                this.$store.commit('setUserData', data)
              })
        }).catch((err) => {
          if (err.response) {
            this.$toast.add({severity: 'error', summary: 'Error', detail: err.response.statusText, life: 3000})
          } else {
            console.log(err)
          }
        })
      }
      if (!changes) {
        this.$toast.add({severity: 'info', summary: 'Info', detail: 'No Changes Made', life: 3000})
      }
    }
  }
}
</script>

<style scoped>

</style>