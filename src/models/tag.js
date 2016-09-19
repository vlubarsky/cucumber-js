export default class Tag {
  constructor(gherkinData) {
    this.line = gherkinData.location.line
    this.name = gherkinData.name

    Object.freeze(this)
  }
}
