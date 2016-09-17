import Attachment from './attachment'
import isStream from 'is-stream'

export default class AttachmentManager {
  constructor() {
    this.attachments = []
  }

  create(data, mimeType) {
    if (Buffer.isBuffer(data)) {
      if (!mimeType) {
        throw Error('Buffer attachments must specify a mimeType')
      }
      this.createBufferAttachment(data, mimeType)
    } else if (isStream.readable(data)) {
      if (!mimeType) {
        throw Error('Stream attachments must specify a mimeType')
      }
      return this.createStreamAttachment(data, mimeType)
    } else if (typeof(data) === 'string') {
      if (!mimeType) {
        mimeType = 'text/plain';
      }
      this.createStringAttachment(data, mimeType)
    } else {
      throw Error('Invalid attachment data: must be a buffer, readable stream, or string')
    }
  }

  createBufferAttachment(data, mimeType) {
    this.createStringAttachment(data.toString('base64'), mimeType)
  }

  createStreamAttachment(data, mimeType) {
    return new Promise((resolve, reject) => {
      const buffers = []
      data.on('data', (chunk) => { buffers.push(chunk) })
      data.on('end', () => {
        this.createBufferAttachment(Buffer.concat(buffers), mimeType)
        resolve()
      })
      data.on('error', reject)
    })
  }

  createStringAttachment(data, mimeType) {
    const attachment = new Attachment({data, mimeType})
    this.attachments.push(attachment)
  }

  getAll() {
    return this.attachments
  }
}
