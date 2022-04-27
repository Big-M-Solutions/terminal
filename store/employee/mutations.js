export function setEmployees (state, payload) {
  state.employees = [...state.employees, ...payload]
}

export function setEmployee (state, employee) {
  state.employee = employee
}

export function lockEmployee (state) {
  state.employee = null
}
