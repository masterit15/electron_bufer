class Users {
  constructor() {
    this.users = []
  }

  add(user) {
    console.log('Сработала функция add(user)');
    this.users.push(user)
  }

  get(sid) {
    console.log('Сработала функция get(id)', sid);
    return this.users.find(user => user.sid === sid)
  }

  remove(sid) {
    console.log('Сработала функция remove(sid)');
    return this.users = this.users.filter(user => user.sid !== sid)
  }

  getByRoom(room) {
    return this.users.filter(user => user.room === room)
  }
}

module.exports = function() {
  return new Users()
}