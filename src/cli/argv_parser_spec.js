import ArgvParser from './argv_parser'

describe('ArgvParser', function() {
  describe('getFormatOptions()', function() {
    describe('without options', function() {
      beforeEach(function() {
        this.argvParser = new ArgvParser({
          argv: ['node', 'cucumber-js'],
          cwd: 'project/path'
        })
      })

      it('returns the default options', async function() {
        const result = this.argvParser.getFormatOptions()
        expect(result).to.eql({
          colorsEnabled: true,
          cwd: 'project/path'
        })
      })
    })

    describe('with options', function() {
      beforeEach(function() {
        this.argvParser = new ArgvParser({
          argv: ['node', 'cucumber-js', '--format-option', 'colorsEnabled=false', '--format-option', 'snippetInterface=promise'],
          cwd: 'project/path'
        })
      })

      it('returns for options', async function() {
        const result = this.argvParser.getFormatOptions()
        expect(result).to.eql({
          colorsEnabled: false,
          cwd: 'project/path',
          snippetInterface: 'promise'
        })
      })
    })

    describe('with overriding options', function() {
      beforeEach(function() {
        this.argvParser = new ArgvParser({
          argv: ['node', 'cucumber-js', '--format-option', 'colorsEnabled=false', '--format-option', 'colorsEnabled=true'],
          cwd: 'project/path'
        })
      })

      it('returns for options', async function() {
        const result = this.argvParser.getFormatOptions()
        expect(result).to.eql({
          colorsEnabled: true,
          cwd: 'project/path'
        })
      })
    })
  })
})
