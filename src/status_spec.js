import Status from './status'

describe('Status', function() {
  describe('getMapping', function() {
    it('returns a mapping of the statuses with the given initial value', function() {
      const result = Status.getMapping(0)
      expect(result).to.eql({
        [Status.AMBIGUOUS]: 0,
        [Status.FAILED]: 0,
        [Status.PASSED]: 0,
        [Status.PENDING]: 0,
        [Status.SKIPPED]: 0,
        [Status.UNDEFINED]: 0
      })
    })
  })
})
