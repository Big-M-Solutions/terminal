export default ({ $auth, $axios, store }, inject) => {
    const auth = {
      open: (options) => {
        window.$nuxt.$emit('Auth', { ...options, open: true })
      },
      close: (options) => {
        window.$nuxt.$emit('Auth', { ...options, open: false })
      },
      // provide credentials as options { username, password }
      login: (options) => {
        // return new Promise((resolve, reject) => {
        //   $auth.loginWith('local', { data: options }).then((data) => {
        //     resolve(true)
        //   }).catch((error) => {
        //     reject(error.response.data.message)
        //   })
        // })
  
        return new Promise((resolve, reject) => {
          $auth.loginWith('local', { data: options }).then((data) => {
            resolve(true)
          }).catch((error) => {
              console.log(error)
            reject(error)
          })
        })
      },
      logout: () => {
        $auth.logout()
      },
      sendForgetPasswordCode: (email) => {
        return new Promise((resolve, reject) => {
          $axios.post('/mvault/resetpassword/sendcode', {
            email
          }
          ).then((data) => {
            resolve(true)
          }).catch((error) => {
            reject(error.response.data.message)
          })
        })
      },
      resetPassword: (payload) => {
        return new Promise((resolve, reject) => {
          $axios.post('/mvault/resetpassword/changepassword', {
            email: payload.email,
            code: payload.code,
            password: payload.password
          }
          ).then(async (data) => {
            if (data && data.status && data.status === 200) {
              const userName = payload.email ? payload.email : ''
              await $auth.loginWith('local', {
                data: {
                  username: userName,
                  password: payload.password
                }
              })
              resolve(true)
            }
          }).catch((error) => {
            reject(error.response.data.message)
          })
        })
      },
      user: () => {
        return $auth.user
      },
      loggedIn: () => {
        return $auth.loggedIn
      }
    }
    inject('Auth', auth)
  }
  