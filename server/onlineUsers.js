class Users {
  constructor() {
    this.users = []
  }

  add(user) {
    this.users.push(user)
  }

  get(id) {
    return this.users.find(user => user.id === id)
  }

  remove(sid) {
    return this.users = this.users.filter(user => user.sid !== sid)
  }

  getByRoom(room) {
    return this.users.filter(user => user.room === room)
  }
}

module.exports = function() {
  return new Users()
}