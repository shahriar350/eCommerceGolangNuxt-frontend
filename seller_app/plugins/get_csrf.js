export default function ({$axios, app}) {

  // const csrftoken = app.$cookies.get('csrf_bongo');
  // if (!csrftoken) {
  //   $axios.get('/api/auth/user/csrf')
  // }
  //
  // $axios.onRequest((config) => {
  //   $axios.setHeader('X-Csrf-Token', csrftoken)
  //   config.xsrfCookieName = "csrf_bongo"
  //   config.xsrfHeaderName = "X-Csrf-Token"
  // })
  // $axios.onError(error => {
  //   if(error.response.status === 403) {
  //     $axios.get('/api/auth/user/csrf')
  //   }
  // })

}
