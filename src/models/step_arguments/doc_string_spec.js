import DocString from './doc_string'

describe('DocString', function () {
  beforeEach(function () {
    this.docString = new DocString({
      content: 'content',
      contentType: 'contentType',
      location: {line: 1}
    })
  })

  describe('getContent()', function () {
    it('returns the content', function () {
      expect(this.docString.getContent()).to.eql('content')
    })
  })

  describe('getContentType()', function () {
    it('returns the doc', function () {
      expect(this.docString.getContentType()).to.eql('contentType')
    })
  })

  describe('getLine()', function () {
    it('returns the line', function () {
      expect(this.docString.getLine()).to.eql(1)
    })
  })
})
