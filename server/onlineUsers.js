class Users {
  constructor() {
    this.users = []
  }

  add(nowUser) {
    console.log('userad', nowUser);
    let index = this.users.findIndex(user => user.sid == nowUser.sid)
    console.log('index', index);
    if(index){
      this.users[index] = nowUser
    }else{
      this.users.push(nowUser)
    }
    
  }

  get(sid) {
    return this.users.find(user => user.sid === sid)
  }

  remove(sid) {
    const user = this.get(sid)

    if (user) {
      this.users = this.users.filter(user => user.sid !== sid)
    }

    return user
  }

  getByRoom(room) {
    return this.users.filter(user => user.room === room)
  }
}

module.exports = function() {
  return new Users()
}