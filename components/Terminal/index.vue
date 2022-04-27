<template>
  <div>
    <div v-if="component" id="modal-id" class=" bg-gray-600 bg-opacity-50 w-screen h-screen animated fadeIn faster  fixed  flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" @click.self="component = null,$emit('close', '')">
      <div class="flex justify-center w-full lg:w-2/4">
        <div class="bg-white shadow-2xl w-full m-2 flex justify-center lg:p-7 p-4 rounded-xl">
          <component :is="'Terminal'+component" v-if="component" :amount="amount" @close="(data) => $emit('close', data)" />
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="connected" class="flex flex-col justify-center items-center my-2" @click="component = 'Update'">
        <span class="bg-gray-100 text-primary px-6 py-1 rounded-xl font-bold">
          Update
        </span>
      </div>
      <div class="flex flex-col justify-center items-center my-2" @click="component = 'Collect'">
        <span class="bg-gray-100 text-primary px-6 py-1 rounded-xl font-bold">
          ManualCollect
        </span>
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
      connected: false,
      component: null
    }
  },
  computed: {
    terminal () {
      return this.$store.getters['payment/terminal']
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    this.$nuxt.$on('terminal-connected', () => {
      this.action()
    })
    this.action()
  },
  methods: {
    async action () {
      this.connected = await this.terminal.getConnectionStatus()
      if (!this.connected) {
        this.component = 'Connect'
      } else if (this.amount > 0) {
        this.component = 'Collect'
      } else {
        this.component = null
      }
    }
  }
}
</script>

<style>

</style>
