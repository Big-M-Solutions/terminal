<template>
  <div id="modal-id" class=" bg-gray-600 bg-opacity-50  h-screen animated fadeIn faster  fixed  flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
    <div v-if="modal" class="px-2 flex   justify-center py-9">
      <div class="bg-white shadow-2xl  w-full   lg:p-7 p-4 rounded-xl ">
        <div class="felx  ">
          <div class="flex justify-end">
            <i class="fa fa-times cursor-pointer text-primary " aria-hidden="true" @click="open=false" />
          </div>
        </div>
        <!--login-->
        <span v-if="action==='login'">

          <div class="flex justify-center text-center  text-2xl font-bold ">
            Login
          </div>
          <!-- <p v-if="errors.length">
                <ul>
                  <li v-for="(error,i) in errors" :key="i">{{ error }}</li>
                </ul>
              </p> -->
          <span v-if="errors.length" class="my-2 ">
            <div v-for="(error,i) in errors" :key="i" class="bg-red-100 border  border-red-400 text-red-700 px-4 py-1 my-2 rounded relative" role="alert">
              <strong class="font-normal ">{{ error }}</strong>
            </div>
          </span>
          <input v-model="credentials.username" class="rounded mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="email" placeholder="Email">
          <!-- <input v-if="!class1" v-model="credentials.username" class="rounded mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="text" placeholder="phone"> -->
          <input v-model="credentials.password" class="rounded mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="password" placeholder="Password" required>
          <div class="flex justify-end mt-1 ">
            <a class="font-meduim cursor-pointer" @click="forgetpass">Forgot your password ?</a>
          </div>
          <button class="bg-primary hover:bg-black text-white font-semibold h-12 mt-6 w-full py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" @click="Login">
            Sign In
          </button>
          <div class="flex justify-center mt-6 ">
            <span class="font-meduim ">New member here ?</span> <span class="font-semibold mx-2 cursor-pointer font-meduim text-primary " @click="ActionSignUp"> Sign up</span>
          </div>
        </span>
        <!--end login-->
        <!--restPassword-->
        <span v-if="action==='Forgotpassword'">
          <div class="flex justify-center text-center  text-2xl font-bold ">
            Forget password

          </div>

          <div class="flex justify-center mt-1 ">
            <span class="font-meduim">We will send you an email to reset your password</span>
          </div>
          <span v-if="errors.length" class="my-2 ">
            <div v-for="(error,i) in errors" :key="i" class="bg-red-100  border border-red-400 text-red-700 px-4 py-1 my-2 rounded relative" role="alert">
              <strong class="font-normal  ">{{ error }}</strong>
            </div>
          </span>
          <input id="username" v-model="email" class="rounded mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="text" placeholder="Email">
          <button class="bg-primary hover:bg-black text-white font-semibold h-12 mt-6 w-full py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button" @click="sendForgetPasswordCode">
            Submit
          </button>
          <button class="border-2 border-primary hover:border-black hover:bg-black hover:text-white text-primary font-semibold h-12 mt-6 w-full py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button" @click="open=false">
            Cancel
          </button>
        </span>
        <!--endrestPassword -->
        <!--Forgot password-->
        <span v-if="action==='restpassword'">

          <div class="flex justify-center text-center text-2xl font-bold ">
            Reset your password
          </div>
          <div class="flex justify-center mt-1 ">
            <span class="font-meduim text-center">Check your email</span>
          </div>
          <span v-if="errors.length" class="my-2 ">
            <div v-for="(error,i) in errors" :key="i" class="bg-red-100 border border-red-400 text-red-700 px-4 py-1 my-2 rounded relative" role="alert">
              <strong class="font-normal">{{ error }}</strong>
            </div>
          </span>
          <input id="username" v-model="reset.code" class="rounded mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="text" placeholder="Confirmation code">
          <input id="username" v-model="reset.email" class="rounded mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="email" placeholder="email">
          <input id="username" v-model="reset.password" class="rounded mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="password" placeholder="New Password">
          <input id="username" v-model="resetconfirmPass" class="rounded mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="password" placeholder="Confirm New Password">

          <button class="bg-primary hover:bg-black text-white font-semibold h-12 mt-6 w-full py-2 px-4 rounded-full focus:outline-none focus:shadow-outline" type="button" @click="resetPassword">
            Confirm
          </button>
        </span>
        <!-- end forgetpassword -->
        <!-- start confirm -->
        <span v-if="action==='verify'">
          <div class="flex justify-center text-center text-2xl font-bold ">
            Enter confirmation code.
          </div>
          <span v-if="errors.length" class="my-2 ">
            <div v-for="(error,i) in errors" :key="i" class="bg-red-100 border border-red-400 text-red-700 px-4 py-1 my-2 rounded relative" role="alert">
              <strong class="font-normal">{{ error }}</strong>
            </div>
          </span>
          <div class="flex justify-center mt-1 ">
            <span class="font-meduim text-center">Enter the code sent to your email</span>
          </div>
          <div class="w-full text-xs py-2 text-center"> Don't forget to check your spam/junk </div>
          <input id="username" v-model="code" class="rounded mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="text" placeholder="Confirmation code">
          <div class="flex justify-end mt-1 ">
            <a v-if="!resendMsgWaiting" class="font-meduim cursor-pointer" @click="ResendCode">resend the code !!</a>
            <a v-if="resendMsgWaiting" class="font-meduim cursor-pointer text-gray-500" @click="ResendCode"> wait 30 soconds</a>
          </div>

          <button class="bg-primary hover:bg-black text-white font-semibold h-12 mt-6 w-full py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button" @click="verifyAccount">
            Submit
          </button>
          <button class="border-2 border-primary hover:border-black hover:bg-black hover:text-white text-primary font-semibold h-12 mt-6 w-full py-2 px-4 rounded-full focus:outline-none focus:shadow-outline" type="button" @click="open=false">
            Cancel
          </button>
        </span>
        <!--end confirm -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'login',
  data () {
    return {
      open: false,
      pass: true,
      modal: true,
      errors: [],
      code: null,
      class1: true,
      phoneNumber1: null,
      valid: true,
      UserconfirmPass: null,
      resetconfirmPass: null,
      resendMsgWaiting: false,
      action: 'login',
      email: null,
      credentials: { username: null, password: null },
      user: { displayname: null, email: null, phone: this.phoneNumber1, password: null },
      reset: { email: null, code: null, password: null },
      resolver: () => null
    }
  },
  mounted () {
    this.$nuxt.$on('Auth', this.dialog)
  },
  methods: {
    async  ResendCode () {
      try {
        this.resendMsgWaiting = true
        setTimeout(() => { this.resendMsgWaiting = false }, 3000)
        const response = await this.$Auth.requestVerification().then((res) => {
          this.resendMsgWaiting = false
        }).catch((e) => {
          this.errors.push(e)
        })

        this.resolver(new Promise(resolve => resolve(response)))
      } catch (err) {
        this.resolver(
          new Promise((resolve, reject) => reject(new Error(err)))
        )
      }
    },
    ActionSignUp () {
      this.action = 'signup'
      this.errors = []
    },
    ActionSignIn () {
      this.action = 'login'
      this.errors = []
    },
    async Login () {
      // eslint-disable-next-line
      const ValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.credentials.username)
      // eslint-disable-next-line
      const ValidPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(this.credentials.username)
      this.errors = []
      if (this.class1) {
        if (ValidEmail) {
          await this.$Auth.login(this.credentials).then((res) => {
            this.open = false
            this.$toast.success('Successfully authenticated').goAway(3000)
          }).catch((e) => {
            this.errors.push(e)
          })
        }
      } else if (!this.class1) {
        if (ValidPhone) {
          await this.$Auth.login(this.credentials).then((res) => {
          }).catch((e) => {
            this.errors.push(e)
          })
        }
      }

      if (this.class1) {
        if (!ValidEmail) {
          this.errors.push('please enter your email address')
        }
      }

      if (!this.class1) {
        if (!ValidPhone) {
          this.errors.push('please enter your Phone.')
        }
      }
    },
    async signUp () {
      // eslint-disable-next-line
      const ValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.user.email)
      // eslint-disable-next-line
      const ValidPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(this.user.phone)
      // eslint-disable-next-line
       const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(this.user.password)
      // const validName = /^[a-zA-Z0-9]+$/.test(this.user.displayname)
      this.errors = []
      if (ValidEmail & ValidPhone & validPassword & this.user.displayname != null & this.UserconfirmPass === this.user.password) {
        try {
          const response = await this.$Auth.register({ displayname: this.user.displayname, email: this.user.email, phone: this.phoneNumber1.formattedNumber, password: this.user.password }).then((res) => {
            this.open = false
            this.$toast.success('Successfully authenticated').goAway(3000)
          }).catch((e) => {
            this.errors.push(e)
          })

          this.resolver(new Promise(resolve => resolve(response)))
        } catch (err) {
          this.resolver(
            new Promise((resolve, reject) => reject(new Error(err)))
          )
        }
      }

      if (!ValidEmail) {
        this.errors.push('email required.')
      }
      if (!ValidPhone) {
        this.errors.push('Phone required.')
      }
      if (!validPassword) {
        this.errors.push('password required.')
      }
      if (!this.user.displayname) {
        this.errors.push('Username required.')
      }
      if (this.UserconfirmPass !== this.user.password) {
        this.errors.push('password false.')
      }
    },
    forgetpass () {
      this.action = 'Forgotpassword'
      this.errors = []
    },
    async sendForgetPasswordCode () {
      // eslint-disable-next-line
      const ValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)
      this.errors = []
      if (ValidEmail) {
        try {
          const response = await this.$Auth.sendForgetPasswordCode(this.email).then((res) => {
            this.action = 'restpassword'
          }).catch((e) => {
            this.errors.push(e)
          })
          this.resolver(new Promise(resolve => resolve(response)))
        } catch (err) {
          this.resolver(
            new Promise((resolve, reject) => reject(new Error(err)))
          )
        }
      }
      if (!ValidEmail) {
        this.errors.push('email required.')
      }
    },
    async resetPassword () {
      // eslint-disable-next-line
      const ValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.reset.email)
      // eslint-disable-next-line
       const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(this.reset.password)
      this.errors = []
      if (validPassword & ValidEmail & this.reset.code != null & this.resetconfirmPass === this.reset.password) {
        try {
          const response = await this.$Auth.resetPassword(this.reset).then((res) => {
            this.open = false
            this.$toast.success('Successfully authenticated').goAway(3000)
          }).catch((e) => {
            this.errors.push(e)
          })

          this.resolver(new Promise(resolve => resolve(response)))
        } catch (err) {
          this.resolver(
            new Promise((resolve, reject) => reject(new Error(err)))
          )
        }
      }
      if (!ValidEmail) {
        this.errors.push('email required.')
      }
      if (!validPassword) {
        this.errors.push('password required.')
      }
      if (!this.reset.code) {
        this.errors.push('code required.')
      }
      if (this.resetconfirmPass !== this.reset.password) {
        this.errors.push('password false.')
      }
    },

    async  verifyAccount () {
      try {
        const response = await this.$Auth.verifyAccount(this.code).then((res) => {
          this.open = false
          this.$toast.success('Successfully Account Verify').goAway(3000)
        }).catch((e) => {
          this.errors.push(e)
        })

        this.resolver(new Promise(resolve => resolve(response)))
      } catch (err) {
        this.resolver(
          new Promise((resolve, reject) => reject(new Error(err)))
        )
      }
    },
    cancel () {
      this.resolver(
        new Promise((resolve, reject) => reject(new Error('cancelled')))
      )
      this.close()
    },
    close () {
      this.open = false
    },
    dialog ({ action, open }) {
      this.open = open
      this.action = action || 'login'
    }
  }
}
</script>
