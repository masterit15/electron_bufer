export default {
  install(Vue, options){
    Vue.prototype.$message = function(text, title, variant){
      this.$bvToast.toast(text, {
        title: title,
        variant: variant,
      })
    }
  }
}