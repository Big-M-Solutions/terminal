export function setLocations (state, payload) {
  state.locations = [...state.locations, ...payload]
}

export function setLocation (state, payload) {
  state.location = payload
}

export function setTaxe (state, payload) {
  state.taxes = payload
}

// cette partie pour la modification des données de state
