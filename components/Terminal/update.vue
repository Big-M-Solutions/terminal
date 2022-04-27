<template>
  <div class="w-full h-4/5">
    <div v-if="isAvailableUpdate.isAvailableUpdate" class="w-full h-4/5 justify-center text-center">
      Thisshouldtake {{ u.estimatedUpdateTime }}
      <button v-if="progress == 0" class="bg-primary hover:bg-black text-white font-semibold h-12 mt-6 w-full py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" @click="install()">
        Update
      </button>
      <div v-else class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div class="bg-blue-600 h-2.5 rounded-full" :style="'width: '+ (Number(progress)*100).toFixed(0)+'%'" />
      </div>
    </div>
    <div v-else class="w-full h-4/5 justify-center text-center">
    Noupdateavailable
      <button class="bg-primary hover:bg-black text-white font-semibold h-12 mt-6 w-full py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" @click="$nuxt.$emit('terminal-connected')">
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isAvailableUpdate: {},
      u: null,
      progress: 0
    }
  },
  computed: {
    terminal () {
      return this.$store.getters['payment/terminal']
    }
  },
  async mounted () {
    this.isAvailableUpdate = await this.terminal.getConnectedReader()
    this.terminal.didReportAvailableUpdate().subscribe((u) => {
      this.u = u
    })
  },
  methods: {
    async install () {
      this.terminal.didReportReaderSoftwareUpdateProgress().subscribe((progress) => {
        this.progress = progress
      })
      await this.terminal.installAvailableUpdate()
    }
  }
}
</script>

<style>

</style>
