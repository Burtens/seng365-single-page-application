<template>
  <div style="justify-content: center; display: flex; align-items: center">
    <Card class="p-align-center" style="width: 400px">
      <template #header>
        <h1>Welcome</h1>
      </template>
      <template #content>
        <div class="p-fluid p-align-center">
          <div class="p-field p-grid">
            <label for="email" class="p-col-fixed" style="width: 100px">Email</label>
            <div class="p-col">
              <InputText v-bind:class="errorUsername" id="email" type="text" v-model="email" />
            </div>
          </div>
          <div class="p-field p-grid">
            <label for="password" class="p-col-fixed" style="width: 100px">Password</label>
            <div class="p-col">
              <InputText v-bind:class="errorPassword" id="password" type="password" v-model="password"/>
            </div>
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
            <Button label="Login" v-on:click="login"/>
          </div>
          <div class="p-col-4">
            <Button label="Sign Up" v-on:click="signUp"/>
          </div>
        </div>

      </template>
    </Card>
  </div>
  <div class="p-p-5">
    <Button label="View Events" v-on:click="goToEvents"/>
  </div>
</template>

<script>
import UserService from "../services/UserService";

export default {
  name: "Login",
  data() {
    return {
      email: '',
      password: '',
      error: '',
      errorPassword: '',
      errorUsername: ''
    }
  },
  userService: null,
  created() {
    this.userService = new UserService()
  },
  methods: {
    signUp() {
      this.$router.push('register')
    },
    goToEvents() {
      this.$router.push('home')
    },
    login() {
      this.userService.login(this.email, this.password).then(() => {
        this.userService.getUser(this.$store.state.userId).then(data => {
          this.$store.commit('setUserData', data)
        })
        this.$router.push('home')
      }).catch((err) => {
        if (err.response !== undefined) {
          if (err.response.status === 400) {
            let errorMsg = err.response.statusText.split(": ")[1]
            if (errorMsg.includes("data.email")) {
              this.error = "Email" + errorMsg.split("data.email")[1]
              this.errorUsername = 'p-invalid'
              this.errorPassword = ''
            } else if (errorMsg.includes("data.password")) {
              this.error = "Password" + errorMsg.split("data.password")[1]
              this.errorPassword = 'p-invalid'
              this.errorUsername = ''
            } else {
              this.error = errorMsg
              this.errorUsername = ''
              this.errorPassword = ''
            }
          } else if (err.response.status === 500) {
            this.$toast.add({severity: 'warn', summary: 'Error', detail: err.response.statusText, life: 3000})
          }
        } else {
          console.log(err)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>