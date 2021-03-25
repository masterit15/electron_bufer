<template>
  <div id="sidebar">
    <div class="logo">
      <img src="../assets/logo.png" alt="logo">
      <h2>BUFER</h2>
    </div>
    <div class="search">
      <i class="fa fa-search"></i>
      <input type="search" name="" id="" placeholder="Поиск">
    </div>
    <ul class="dir_list">
      <li v-for="(dir, index) in dirList" :key="index" @click="dirClick(dir)">{{dir}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeDir: ''
    }
  },
  computed: {
    dirList(){
      let list = []
      this.$fs.readdirSync(this.$path.resolve('./'), { withFileTypes: true }).map(d => {
        const stats = this.$fs.statSync(d);
        if(stats.isDirectory()){
          list.push(d)
        }
      })
      return list
    }
  },
  watch: {
    // activeDir(){
    //   // let watcher = this.$chokidar.watch(this.$path.resolve(this.activeDir), { persistent: true });
    //   // watcher
    //   //   .on('add', function(path) {console.log('File', path, 'has been added');})
    //   //   .on('change', function(path) {console.log('File', path, 'has been changed');})
    //   //   .on('unlink', function(path) {console.log('File', path, 'has been removed');})
    //   //   .on('error', function(error) {console.error('Error happened', error);})
    // }
  },
  mounted() {
    // this.$watchet.on('file-added', log => {
    //     console.log(log.message);
    // });
    this.dirList.forEach(dir => {
      // this.$fs.watch(this.$path.resolve(dir), (eventType, filename) => {
      //   console.log(eventType);
      //   console.log(filename);
      //   // this.streamDir(this.$path.resolve(dir))
      // })
      // this.$watchet.watchFolder(this.$path.resolve(dir));
    });
    

    
  },
  methods: {
    dirClick(dir){
      this.activeDir = dir
      this.$emit('dir', dir)
    },
    onClick (text) {
        alert(`You clicked ${text}!`);
    }
  },
}
</script>