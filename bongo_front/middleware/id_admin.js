export default function ({store, redirect, $axios}) {
  $axios.$get('/api/auth/admin/check')
    .then(() => {
      return true
    }) .catch(() => {
      return redirect('')
  })
  if (store.state.is_user) {
    return true
  } else {
    return redirect('/auth/user/login')
  }
}
