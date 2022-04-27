<template>
  <div class="flex flex-col justify-center items-center lg:w-2/3 w-full">
    <div class="flex justify-center items-center">
      <section class="flex bg-gray-100 w-80 h-16 rounded-full mb-10">
        <button v-for="method in methods" :key="method.label" :class="`h-full w-1/2 rounded-full font-semibold grid place-content-center ${DiscoveryMethod == method.method && 'bg-primary text-white'}`" @click="discover(method.method)">
          {{ method.label }}
        </button>
      </section>
    </div>
    <h1 class="font-bold mb-2">
      SelelctReader :
    </h1>
    <div v-for="rd in getReaders" :key="rd.serialNumber" class="flex flex-col justify-center items-center my-2" @click="connectReader(rd)">
      <span class="bg-gray-100 text-primary px-6 py-1 rounded-xl font-bold">
        {{ rd.serialNumber }}
      </span>
      <span v-if="rd.label" class="text-sm font-semibold italic">
        {{ rd.label }}
      </span>
    </div>
  </div>
</template>

<script>
import {
  StripeTerminalPlugin,
  DiscoveryMethod
} from 'capacitor-stripe-terminal'
import { Capacitor } from '@capacitor/core'

export default {
  data () {
    return {
      serialNumber: null,
      DiscoveryMethod: null,
      terminal: null,
      readers: [],
      methods: []
    }
  },
  computed: {
    getReaders () {
      return this.readers
    }
  },
  async mounted () {
    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      this.methods = [{
        method: 'Internet',
        label: 'WisePOS'
      },
      {
        method: 'BluetoothProximity',
        label: 'Mobile Readers'
      }
      ]
    } else {
      this.methods = [{
        method: 'Internet',
        label: 'WisePOS'
      }]
      this.DiscoveryMethod = 'Internet'
    }
    if (Capacitor.getPlatform() === 'android') {
      let response = await StripeTerminalPlugin.checkPermissions()

      if (response.location === 'prompt') {
        // if it is required, request it
        response = await StripeTerminalPlugin.requestPermissions()

        if (response.location !== 'granted') {
          // if the request fails, show a message to the user
          return this.$toast.error('Location permission is required.')
        }
      }
    }
    this.terminal = await this.$store.getters['payment/terminal']
    // this.serialNumber = this.$cookies.get('serialNumber') || null
    // this.DiscoveryMethod = this.$cookies.get('DiscoveryMethod') || null
    if (this.DiscoveryMethod) {
      this.discover(this.DiscoveryMethod)
    }
  },
  methods: {
    async connectReader (reader) {
      const selectedReader = reader
      const connectionConfig = {
        locationId: this.$store.getters['payment/account'].terminal_location,
        failIfInUse: true
      }
      if (this.DiscoveryMethod === 'BluetoothProximity') {
        this.$nuxt.$loading.start()
        await this.terminal
          .connectBluetoothReader(selectedReader, connectionConfig)
          .then((connectedReader) => {
            this.$cookies.set('serialNumber', reader.serialNumber)
            this.$nuxt.$emit('terminal-connected')
            // the reader is now connected and usable
          })
          .catch((e) => {
            this.$toast.error(e).goAway(3000)
          })
        this.$nuxt.$loading.finish()
      } else {
        this.$nuxt.$loading.start()
        await this.terminal
          .connectInternetReader(selectedReader, connectionConfig)
          .then((connectedReader) => {
            this.$cookies.set('serialNumber', reader.serialNumber)
            this.$nuxt.$emit('terminal-connected')
            // the reader is now connected and usable
          })
          .catch((e) => {
            this.$toast.error(e).goAway(3000)
            console.log(e)
            return e
          })
        this.$nuxt.$loading.finish()
      }
    },
    discover (method) {
      this.DiscoveryMethod = method
      this.$cookies.set('DiscoveryMethod', method)
      this.terminal
        .discoverReaders({
          simulated: false,
          discoveryMethod: DiscoveryMethod[this.DiscoveryMethod]
        })
        .subscribe((readers) => {
          if (readers.length) {
            this.readers = readers
            if (this.serialNumber && this.readers.find(v => v.serialNumber === this.serialNumber)) {
              this.connectReader(this.readers.find(v => v.serialNumber === this.serialNumber))
            }
          }
        })
    }
  }
}
</script>

<style>

</style>
