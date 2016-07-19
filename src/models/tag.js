export default class Tag {
  constructor(data) {
    this.data = data
  }

  getLine() {
    return this.data.location.line
  }

  getName() {
    return this.data.name
  }
}
