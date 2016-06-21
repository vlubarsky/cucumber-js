import Configuration from './configuration'

describe('configuration', function() {
  describe('getCompilerExtensions / getCompilerModules', function() {
    describe('no compilers', function() {
      beforeEach(function() {
        this.configuration = new Configuration({
          options: {
            compiler: []
          }
        })
      })

      it('returns empty arrays', function() {
        expect(this.configuration.getCompilerExtensions()).to.eql([])
        expect(this.configuration.getCompilerModules()).to.eql([])
      })
    })

    describe('one compiler', function() {
      beforeEach(function() {
        this.configuration = new Configuration({
          options: {
            compiler: ['js:babel-register']
          }
        })
      })

      it('returns the proper extensions and modules', function() {
        expect(this.configuration.getCompilerExtensions()).to.eql(['js'])
        expect(this.configuration.getCompilerModules()).to.eql(['babel-register'])
      })
    })
  })
})
