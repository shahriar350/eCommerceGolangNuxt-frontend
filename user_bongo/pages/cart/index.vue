<script>
export default {
  middleware({ store, redirect }) {
    // If the user is not authenticated
    if (!store.state.is_user) {
      return redirect('/cart/non_auth')
    } else {
      return redirect('/cart/auth')
    }
  },
}
</script>
