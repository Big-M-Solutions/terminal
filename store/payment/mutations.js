
export function terminal (state, terminal) {
  state.terminal = terminal
}

export function disconnect (state) {
  state.reader = null
}

export function addCharge (state, charge) {
  state.charges = [...state.charges, charge]
}

export function updateCharge (state, charge) {
  const index = state.charges.findIndex(element => element._key === charge._key)
  state.charges.splice(index, 1, charge)
}

export function deleteCharge (state, charge) {
  const index = state.charges.findIndex(element => element._key === charge._key)
  state.charges.splice(index, 1)
}

export function account (state, account) {
  state.account = account
}
export function resetPay (state) {
  state.selectedCard = null
  state.clientSecret = null
  state.transaction = null
  state.charges = []
  state.cash = 0
  state.card = 0
  state.cardPresent = 0
  state.total = 0
}

export function setCharges (state, charges) {
  state.charges = charges
}

// cette partie pour la modification des données de state
