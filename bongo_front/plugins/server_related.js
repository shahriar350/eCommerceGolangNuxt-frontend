
// export default function ({$axios, app }) {
//   const csrftoken = app.$cookies.get('csrftoken');

//   if (!csrftoken){
//     $axios.get('/api/auth/mytoken/')
//   }
//   $axios.setHeader('X-CSRFToken', csrftoken)
// }
export default function ({$axios, app}) {
  //
  // const csrftoken = app.$cookies.get('csrf_bongo');
  // if (!csrftoken) {
  //   $axios.get('/api/auth/user/csrf')
  // }
  // $axios.onRequest((config) => {
  //   config.xsrfCookieName = "csrf_bongo"
  //   config.xsrfHeaderName = "X-Csrf-Token"
  // })
  // $axios.onError(error => {
  //   if(error.response.status === 403) {
  //     $axios.get('/api/auth/user/csrf')
  //   }
  // })
  // $axios.setHeader('X-Csrf-Token', csrftoken)
}

