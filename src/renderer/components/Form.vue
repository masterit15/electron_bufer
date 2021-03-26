<template>
  <form @submit.prevent="authBufer" class="forma_auth">
    <select v-model="departamentSelect">
      <option v-for="departament in departaments" :key="departament.id" :value="departament.id">{{departament.name}}</option>
    </select>
    <input type="text" v-model="name">
  </form>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import os from 'os'

const username = os.userInfo().username
let username2 = process.env.username || process.env.user;
const child = require('child_process');
let exec = child.exec;
execute(`wmic useraccount get name`, function(res) {
    console.log(res);
})
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ 
      let result = null;

      if(!error){

        var splitted = stdout.split("\n");    
        var username = '';
        var fullname = '';

        for(var i=0; i < splitted.length; i++){
          if(splitted[i].search("User name") != -1){
            splitted[i] = splitted[i].replace('User name',' ');
            splitted[i] = splitted[i].trim();
            username = splitted[i];
          }else if(splitted[i].search("Full Name") != -1){
            splitted[i] = splitted[i].replace('Full Name',' ');
            splitted[i] = splitted[i].trim();
            fullname = splitted[i];
          }
        }

        let data = {
          username: (username) ? username.toLowerCase() : null,
          fullname: (fullname) ? fullname: null
        }

        result = data;
      } else{
        result = null;
      }
      callback(result); 
    });
  };
  
export default {
  data(){
    return {
      departamentSelect: '',
      name: '' || username
    }
  },
  computed: {
    ...mapGetters(['departaments'])
  }
}
</script>