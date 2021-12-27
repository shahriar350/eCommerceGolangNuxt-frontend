export default function ({store, redirect}) {
  if (store.state.is_user && store.state.user.seller){
    return true
  } else {
    return redirect('/auth/seller/login')
  }
}
