
import {
  StripeTerminalPlugin
} from 'capacitor-stripe-terminal'
import { Capacitor } from '@capacitor/core'

export async function account ({ commit }) {
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
  this.$axios.get('/kitchen/terminal')
    .then(async ({ data }) => {
      commit('account', data[0])
      const terminal = await StripeTerminalPlugin.create({
        fetchConnectionToken: async () => {
          const resp = await this.$axios.get('/kitchen/terminal/GetConnectionToken', {
            params: {
              account_id: data[0].merchant,
              terminal_location: data[0].terminal_location
            }
          })
          return resp.data.secret
        },
        onUnexpectedReaderDisconnect: () => {
          commit('disconnect')
        }
      })
      commit('terminal', terminal)
    })
}

export function resetPay ({ commit }) {
  commit('resetPay')
}

export function charge ({ commit, getters, rootGetters, dispatch }, payload) {
  return new Promise((resolve, reject) => {
    const paymentData = {
      source: 'POS',
      order: rootGetters['order/order'].id, // check if there is an order,
      bac: rootGetters['location/location'].bac.id,
      amount: payload.amount,
      transaction: getters.charges.length ? getters.charges[0].transaction : undefined,
      operator: rootGetters['employee/employee'].user.id,
      total: rootGetters['order/order'].total,
      method: payload.method,
      location: rootGetters['order/order'].location
    }
    this.$axios.post('/kitchen/payments/charge', paymentData)
      .then(({ data }) => {
        commit('addCharge', data)
        resolve(data)
      })
      .catch((e) => {
        console.log(e)
      })
  })
}

export async function confirm ({ commit }, charge) {
  await this.$axios.post('/kitchen/payments/confirm', { _key: charge._key })
    .then(({ data }) => {
      commit('updateCharge', data)
    })
    .catch((e) => {
      console.log(e)
    })
}

export async function cancel ({ commit }, payload) {
  if (charge) {
    await this.$axios.post('/kitchen/payments/cancel', { _key: payload.charge._key, amount: payload.amount })
      .then(({ data }) => {
        if (payload.amount) {
          commit('updateCharge', data)
        } else {
          commit('deleteCharge', data)
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

export function init ({ commit }, transaction) {
  if (transaction) {
    this.$axios.get('/kitchen/payments/charges/' + transaction)
      .then(({ data }) => {
        commit('setCharges', data)
      })
      .catch((e) => {
        console.log(e)
      })
  }
}
