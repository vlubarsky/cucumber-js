export default class Attachment {
  constructor({data, mimeType}) {
    this.data = data
    this.mimeType = mimeType
  }

  getData() {
    return this.data
  }

  getMimeType() {
    return this.mimeType
  }
}
