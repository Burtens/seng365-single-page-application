<template>
  <div style="justify-content: center; display: flex; align-items: center;">
    <Card style="width: 500px">
      <template #header>
        <h1>Sign Up</h1>
      </template>
      <template #content>
        <div class="p-fluid p-align-center">
          <div class="p-field p-grid">
            <label for="fname" class="p-col-fixed" style="width: 100px">First Name*</label>
            <div class="p-col">
              <InputText v-bind:class="errorFirstName" id="fname" type="text" v-model="firstName" />
            </div>
          </div>
          <div class="p-field p-grid">
            <label for="lname" class="p-col-fixed" style="width: 100px">Last Name*</label>
            <div class="p-col">
              <InputText v-bind:class="errorLastName"  id="lname" type="text" v-model="lastName" />
            </div>
          </div>
          <div class="p-field p-grid">
            <label for="email" class="p-col-fixed" style="width: 100px">Email*</label>
            <div class="p-col">
              <InputText v-bind:class="errorUsername" id="email" type="text" v-model="email" />
            </div>
          </div>
          <div class="p-field p-grid">
            <label for="password" class="p-col-fixed" style="width: 100px">Password*</label>
            <div class="p-col">
              <InputText v-bind:class="errorPassword" id="password" type="password" v-model="password"/>
            </div>
          </div>
          <label class="p-col-fixed" style="width: 100px">Upload Profile Image (optional)</label>
          <div class="p-col">
            <FileUpload :auto="true" :customUpload="true"
                        @uploader="uploadImage" name="demo[]" mode="basic" accept=".jpeg, .png, .gif, .jpg"></FileUpload>
          </div>
          <div class="p-col">
            <InlineMessage severity="success" v-if="image !== null" v-text="image.name" ></InlineMessage>
          </div>
        </div>
        <div class="p-grid">
          <div class="p-col">
            <InlineMessage v-if="error !== ''" v-text="error" ></InlineMessage>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="p-grid p-jc-evenly">
          <div class="p-col-4">
            <Button label="Sign Up" v-on:click="createAccount"/>
          </div>
          <div class="p-col-6">
            <Button label="Back to Login" v-on:click="backToLogin"/>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import UserService from "../services/UserService";

export default {
  name: "Register",
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      image: null,
      error: '',
      errorUsername: '',
      errorPassword: '',
      errorFirstName: '',
      errorLastName: ''
    }
  },
  userService: null,
  created() {
    this.userService = new UserService()
  },
  methods: {
    backToLogin() {
      this.$router.push('login')
    },
    uploadImage(event) {
      this.image = event.files[0]
      console.log(event.files[0])
    },
    createAccount() {
      if (this.password.length < 8) {
        this.error = "Password should be at least 8 characters long"
        this.errorPassword = 'p-invalid'
        this.errorUsername = ''
        this.errorFirstName = ''
        this.errorLastName = ''
      } else {
        this.userService.signUp(this.firstName, this.lastName, this.email, this.password).then(() => {
          this.$toast.add({severity:'success', summary: 'Success', detail: "New Account Created", life: 3500})
          this.userService.login(this.email, this.password).then(() => {
            if (this.image !== null) {
              this.userService.setImage(this.image, this.$store.state.userId)
            }
            this.userService.getUser(this.$store.state.userId).then(data => {
              this.$store.commit('setUserData', data)
              this.$router.push('home')
            })
          })
        }).catch(err => {
          if (err.response !== undefined) {
            if (err.response.status === 400) {
              let errorMsg = err.response.statusText.split(": ")[1]
              if (errorMsg.includes("email")) {
                if (errorMsg.includes("data.email")) {
                  this.error = "Email" + errorMsg.split("data.email")[1]
                } else {
                  this.error = errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1)
                }
                this.errorUsername = 'p-invalid'
                this.errorPassword = ''
                this.errorFirstName = ''
                this.errorLastName = ''
              } else if (errorMsg.includes("data.password")) {
                this.error = "Password" + errorMsg.split("data.password")[1]
                this.errorPassword = 'p-invalid'
                this.errorUsername = ''
                this.errorFirstName = ''
                this.errorLastName = ''
              } else if (errorMsg.includes("data.firstName")) {
                this.error = "First Name" + errorMsg.split("data.firstName")[1]
                this.errorUsername = ''
                this.errorPassword = ''
                this.errorFirstName = 'p-invalid'
                this.errorLastName = ''
              } else if (errorMsg.includes("data.lastName")) {
                this.error = "Last Name" + errorMsg.split("data.lastName")[1]
                this.errorUsername = ''
                this.errorPassword = ''
                this.errorFirstName = ''
                this.errorLastName = 'p-invalid'
              } else {
                this.error = errorMsg
              }
            } else if (err.response.status === 500) {
              this.$toast.add({severity: 'warning', summary: 'Error', detail: err.response.statusText, life: 3000})
            }
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