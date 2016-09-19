import Tag from './tag'

describe('Tag', function () {
  beforeEach(function () {
    this.tag = new Tag({
      location: {line: 1},
      name: '@tagA'
    })
  })

  describe('get line', function () {
    it('returns the line', function () {
      expect(this.tag.line).to.eql(1)
    })
  })

  describe('get name', function () {
    it('returns the name', function () {
      expect(this.tag.name).to.eql('@tagA')
    })
  })
})
