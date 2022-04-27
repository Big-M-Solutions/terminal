export async function loadLocation ({ commit, dispatch, rootGetters }, id) {
  try {
    const { data } = await this.$axios.post('/graphql',
      {
        query: 'query ($id: String){location(id: $id){timezone,bac{id},workinghours{workinghours{day,isOpen,schedule{from,to}},hdays},settings{fulfillment_types,delivery{isDelivery,fee,min,zipcodes}},tags,id,name ,cuisines,rating, company{id,name,description,logo},address{street city state postcode country},menus{id, name, hours{from,to}, default},location,isOpen,img,slug}}',
        variables: { id }
      })
    commit('setLocation', data.location)
    dispatch('payment/account', null, { root: true })

    if (rootGetters['employee/employees'].length === 0) { await dispatch('employee/loadEmployees', null, { root: true }) }
  } catch (err) {
    console.log(err)
    this.$router.push('/404')
  }
}
