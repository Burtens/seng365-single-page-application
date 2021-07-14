<template>
  <MenuBar :model="items" style="position: sticky">
    <template #end>
      <Button v-if="isValidated" label="Logout" icon="pi pi-sign-out" iconPos="left" v-on:click="logout"/>
      <Button v-else icon="pi pi-sign-in" iconPos="left" label="Login" v-on:click="goToLogin"/>
    </template>
  </MenuBar>
  <div class="p-grid p-jc-center">
    <RouterView></RouterView>
  </div>
</template>

<script>
import UserService from "../services/UserService";
import EventService from "../services/EventService";

export default {
  name: "Home",
  data() {
    return {
      items: [
        {
          label: 'Profile',
          icon: 'pi pi-fw pi-home',
          to: '/home/profile',
          visible: () => this.isValidated
        },
        {
          label: 'Find Events',
          icon: 'pi pi-map-marker',
          to: '/home'
        },
        {
          label: 'My Events',
          icon: 'pi pi-ticket',
          command: this.getUserEvents,
          visible: () => this.isValidated
        }

      ]
    }
  },
  userService: null,
  eventService: null,
  created() {
    this.userService = new UserService()
    this.eventService = new EventService()
  },
  methods: {
    logout() {
      this.userService.logout().then(() => {
        this.$store.commit('setToken', '')
        this.$router.push('/login')
      }).catch((err) => {
        this.$toast.add({severity: 'error', summary: 'Error', detail: err.response.statusText, life: 3000})
      })
    },
    goToLogin() {
      this.$router.push('/login')
    },
    async getUserEvents() {

      this.eventService.setEventsAttending()

      this.eventService.setEventsOrganized()

      this.eventService.getCategories().then(data => {
        this.$store.commit('setCategories', data)
        this.$router.push('/home/events')
      })
    }
  },
  computed: {
    isValidated: (val) => { return !!val.$store.state.validationToken }
  }
}
</script>

<style scoped>

</style>