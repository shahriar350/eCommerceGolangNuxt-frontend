export default function ({store, redirect}) {
  if (store.state.is_user && parseInt(store.state.user.role) > 5){
    return true
  } else {
    return redirect('/auth/login')
  }
}
