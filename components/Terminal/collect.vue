<template>
  <div class="w-full h-4/5">
    <div v-if="amount == 0" class="w-full h-4/5 justify-center text-center">
      <input v-model="Amount" class="rounded mt-6 w-full h-11 py-2 px-3 text-gray-400 ring-1 ring-gray-400" type="number" placeholder="Amount">
      <button class="bg-primary hover:bg-black text-white font-semibold h-12 mt-6 w-full py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" :disabled="Amount <= 0" @click="collect(Number((Amount * 100).toFixed(0))), manualCollect = true">
        Collect
      </button>
    </div>
    <div v-if="!err" class="w-full h-4/5 justify-center text-center">
      {{ displayMessage }} <br>
      {{ inputOptions }}
    </div>
    <div v-else>
      <div class="grid  text-primary">
        <span class="w-full grid col-1 text-center font-bold"> {{ err }}</span>
        <span class="w-full justify-center flex">
          <button class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border w-2/4 my-3 justify-center border-red-500 text-red-600 rounded-full hover:shadow-lg hover:bg-gray-100" @click="pay(charge)">
            Tryagain
          </button></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      default: 0
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
    async collect (amount) {
      try {
        const checkSplitPayment = this.$check.checkSplitPayment(amount)
        if (checkSplitPayment.check) {
          const charge = await this.$store.dispatch('payment/charge', { method: 'card-present', amount })
          if (charge) {
            await this.pay(charge)
          } else {
            this.$emit('close', { status: 'failed', message: 'something went wrong ! please try again' })
          }
        } else {
          this.$emit('close', { status: 'failed', message: checkSplitPayment.message })
        }
      } catch (e) {
        this.$emit('close', { status: 'failed', message: 'something went wrong ! please try again' })
      }
    },
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

<style>

</style>
