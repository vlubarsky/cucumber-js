export default class DocString {
  constructor(data) {
    this.data = data
  }

  getContent() {
    return this.data.content
  }

  getContentType() {
    return this.data.contentType
  }

  getLine() {
    return this.data.location.line
  }
}
