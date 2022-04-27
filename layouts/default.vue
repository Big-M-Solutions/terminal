<template>
  <div>
    <Nuxt />
  </div>
</template>

<script>
import { PushNotifications } from '@capacitor/push-notifications'
export default {
  async mounted () {
    // this.$nextTick(() => {
    //   this.$nuxt.$loading.start()

    //   setTimeout(() => this.$nuxt.$loading.finish(), 500)
    // })

    if (this.$auth.loggedIn && this.$auth.user.roles.length) {
      PushNotifications.register()
      this.$store.dispatch('location/loadLocation', this.$auth.user.roles[0].location)
      // PushNotifications.addListener(
      //   'registration',
      //   async (token) => {
      //     await this.$axios
      //       .$post('/kitchen/notification/subscribe', {
      //         app: 'POS',
      //         location: this.$auth.user.roles[0].location,
      //         token: token.value
      //       })
      //       .then(
      //         async ({ data }) => {
      //           this.$store.commit('utiles/setNotificationToken', token.value)
      //           await this.$store.dispatch('location/loadLocation', this.$auth.user.roles[0].location)
      //         })
      //       .catch((error) => {
      //         console.error(error)
      //       })
      //   }
      // )
    } else if (!this.$auth.user.roles.length) {
      this.$auth.logout()
    }
  }
}
</script>
