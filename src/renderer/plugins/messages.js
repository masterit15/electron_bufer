export default {
  install(Vue, options){
    Vue.prototype.$message = function(text, title, variant, id = '', hideTime = 5000, ){
      this.$bvToast.toast(text, {
        id: String(id) ,
        title: title,
        variant: variant,
        autoHideDelay: hideTime,
      })
      return id
    }
  }
}