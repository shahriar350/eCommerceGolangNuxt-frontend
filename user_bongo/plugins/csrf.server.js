export default function ({$axios, app }) {
  const csrftoken = app.$cookies.get('csrf_bongo');

  if (!csrftoken){
    $axios.get('/api/auth/user/csrf')
  }
  $axios.setHeader('X-CSRFToken', csrftoken)
}
