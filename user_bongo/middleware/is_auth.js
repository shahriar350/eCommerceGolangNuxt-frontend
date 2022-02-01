export default function ({store, redirect,route,app }) {
  // if (route.path !== '/auth/login' && route.path !== '/auth/register'){
  //   store.commit('set_target_page',route.path)
  // }
  if (store.state.is_user){
    return true
  } else {
    if (route.path !== '/auth/login' && route.path !== '/auth/register'){
      store.commit('set_target_page',route.path)
    }
    return redirect('/auth/login')
  }
}
