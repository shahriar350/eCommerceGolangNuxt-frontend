export default function ({store, redirect,route,app }) {
  if (route.path !== '/auth/user/login' && route.path !== '/auth/user/register'){
    app.$cookies.set('bongobitan_target', route.path, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
  }
  if (store.state.is_user){
    return true
  } else {
    return redirect('/auth/user/login')
  }
}
