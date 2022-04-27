// export default function ({ $axios, $auth, redirect }) {
//     $axios.onRequest(() => {
//       this.$nuxt.$loading.start()
//     })
//     $axios.onResponse(() => {
//       this.$nuxt.$loading.finish()
//     })
//     $axios.onError(async (error) => {
//       this.$nuxt.$loading.finish()
//       const code = parseInt(error.response && error.response.status)
//       if (code === 403 || code === 401) {
//         await $auth.logout()
//         redirect('/login')
//       }
//     })
//   }
  