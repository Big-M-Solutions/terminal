export async function loadEmployees ({ commit, rootGetters }) {
  try {
    const data = await this.$axios.get('/mvault/pos/roles', { params: { location: rootGetters['location/location'].id } })
    commit('setEmployees', data.data)
  } catch (error) {}
}

export function setEmployee ({ commit }, employee) {
  commit('setEmployee', employee)
}

export function lockEmployee ({ commit }) {
  commit('lockEmployee')
}
