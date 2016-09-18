import HookDefinition from './hooK_definition'


describe('HookDefinition', function () {
  describe('appliesToScenario', function () {
    beforeEach(function() {
      this.scenario = {
        getTags: sinon.stub().returns([]),
        getUri: sinon.stub().returns('')
      }
    })

    describe('no tags', function() {
      beforeEach(function() {
        this.hookDefinition = new HookDefinition({options: {}})
      })

      it('returns true', function() {
        expect(this.hookDefinition.appliesToScenario(this.scenario)).to.be.true
      })
    })

    describe('tags match', function() {
      beforeEach(function() {
        this.scenario.getTags.returns([
          {getName: sinon.stub().returns('@tagA')}
        ])
        this.hookDefinition = new HookDefinition({options: {tags: '@tagA'}})
      })

      it('returns true', function() {
        expect(this.hookDefinition.appliesToScenario(this.scenario)).to.be.true
      })
    })

    describe('tags do not match', function() {
      beforeEach(function() {
        this.hookDefinition = new HookDefinition({options: {tags: '@tagA'}})
      })

      it('returns false', function() {
        expect(this.hookDefinition.appliesToScenario(this.scenario)).to.be.false
      })
    })
  })
})
