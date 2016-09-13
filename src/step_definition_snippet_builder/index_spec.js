import StepDefinitionSnippetBuilder from './'

describe('StepDefinitionSnippetBuilder', function () {
  beforeEach(function () {
    this.step = {}
    this.snippetSyntax = {build: sinon.stub()}
    this.snippetBuilder = new StepDefinitionSnippetBuilder(snippetSyntax)
  })

  describe('build()', function () {
    describe('step is an precondition step', function() {
      it('uses Then as the function name', function() {

      })
    })

    describe('step is an event step', function() {
      it('uses When as the function name', function() {

      })
    })

    describe('step is an outcome step', function() {
      it('uses When as the function name', function() {

      })
    })
  })
})
