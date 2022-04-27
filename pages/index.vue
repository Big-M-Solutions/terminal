<template>
<div>
  <div class="w-full flex p-4 justify-end" @click="$router.push('/settings')"><svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
  <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
</svg></div>
  <div class=" flex justify-center">

  <div class="bg-white shadow-2xl w-full m-2 lg:w-2/6 mt-52   lg:p-7 p-4 rounded-xl">
<div class="text-red-600 font-bold text-center text-h6 w-full">Terminal</div>
          <input class="rounded-lg mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="email" placeholder="Amount">
<button class="bg-red-600 text-white w-full py-2 rounded-lg mt-4" @click="pay">Pay</button>
  </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'IndexPage',
  mounted(){
    if (!this.$cookies.get('auth._token.local')) {
      this.$router.push('login')
      
    }
  },
 data () {
    return {
      displayMessage: 'Insert the presented card.',
      inputOptions: null,
      err: null,
      payment: {},
      charge: null,
      charged: false,
      manualCollect: false
    }
  },
  computed: {
    terminal () {
      return this.$store.getters['payment/terminal']
    }
  },
  async beforeDestroy () {
    try {
      if (!this.charged) {
        await this.terminal.abortCollectPaymentMethod()
      }
    } catch (error) {}
  },
  mounted () {
    if (this.amount > 0) {
      this.collect(this.amount)
    }
  },
  methods: {
    async pay (charge) {
      this.charge = charge
      this.err = null
      const displaySubscription = this.terminal
        .didRequestReaderDisplayMessage()
        .subscribe((displayMessage) => {
          switch (displayMessage) {
            case 1:
              this.displayMessage = 'Insert the presented card.'
              break
            case 2:
              this.displayMessage = 'Insert or swipe the presented card.'
              break
            case 3:
              this.displayMessage = 'The reader detected multiple contactless cards. Make sure only one contactless card or NFC device is near the reader.'
              break
            case 4:
              this.displayMessage = 'Remove the presented card.'
              break
            case 5:
              this.displayMessage = 'Retry the presented card.'
              break
            case 6:
              this.displayMessage = 'Swipe the presented card.'
              break
            case 7:
              this.displayMessage = 'The card is invalid. Try another card.'
              break
            case 8:
              this.displayMessage = 'The card could not be read. Try another read method on the same card, or use a different card.'
              break
          }
        })
      const inputSubscription = this.terminal
        .didRequestReaderInput()
        .subscribe((inputOptions) => {
          this.inputOptions = inputOptions
        })

      // retrieve the payment intent
      await this.terminal.retrievePaymentIntent(charge.data.client_secret)

      // collect the payment method
      await this.terminal.collectPaymentMethod().catch((e) => {
        this.err = e.message
        // return this.$emit('close', { status: 'failed', message: e.message })
      })

      // and finally, process the payment
      await this.terminal.processPayment().then(async (intent) => {
        this.displayMessage = 'Payment successful'
        this.inputOptions = ''
        await this.$store.dispatch('payment/confirm', charge)
        this.charged = true
        this.$emit('close', { status: 'success', message: 'payment succeeded' })
      }).catch((e) => {
        this.err = e.message
        // return this.$emit('close', { status: 'failed', message: e.message })
      })

      // once you are done, make sure to unsubscribe (e.g. in ngOnDestroy)
      displaySubscription.unsubscribe()
      inputSubscription.unsubscribe()
    }
  }
}
</script>
