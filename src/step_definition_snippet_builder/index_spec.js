import KeywordType from '../keyword_type'
import StepDefinitionSnippetBuilder from './'
import DataTable from '../models/step_arguments/data_table'
import DocString from '../models/step_arguments/doc_string'

describe('StepDefinitionSnippetBuilder', function () {
  beforeEach(function () {
    this.snippetSyntax = createMock(['build'])
    this.snippetBuilder = new StepDefinitionSnippetBuilder(this.snippetSyntax)
  })

  describe('build()', function () {
    beforeEach(function() {
      this.step = createMock({
        getArguments: [],
        getKeywordType: KeywordType.PRECONDITION,
        getName: ''
      })
    })

    describe('step is an precondition step', function() {
      beforeEach(function() {
        this.step.getKeywordType.returns(KeywordType.PRECONDITION)
        this.result = this.snippetBuilder.build(this.step)
      })

      it('uses Given as the function name', function() {
        expect(this.snippetSyntax.build.firstCall.args[0]).to.eql('Given')
      })
    })

    describe('step is an event step', function() {
      beforeEach(function() {
        this.step.getKeywordType.returns(KeywordType.EVENT)
        this.result = this.snippetBuilder.build(this.step)
      })

      it('uses When as the function name', function() {
        expect(this.snippetSyntax.build.firstCall.args[0]).to.eql('When')
      })
    })

    describe('step is an outcome step', function() {
      beforeEach(function() {
        this.step.getKeywordType.returns(KeywordType.OUTCOME)
        this.result = this.snippetBuilder.build(this.step)
      })

      it('uses Then as the function name', function() {
        expect(this.snippetSyntax.build.firstCall.args[0]).to.eql('Then')
      })
    })

    describe('step has simple name', function() {
      beforeEach(function() {
        this.step.getName.returns('abc')
        this.result = this.snippetBuilder.build(this.step)
      })

      it('wraps the string in a full regex', function() {
        expect(this.snippetSyntax.build.firstCall.args[1]).to.eql('/^abc$/')
      })
    })

    describe('step name has a quoted string', function() {
      beforeEach(function() {
        this.step.getName.returns('abc "def" ghi')
        this.result = this.snippetBuilder.build(this.step)
      })

      it('replaces the quoted string with a capture group and adds a parameter', function() {
        expect(this.snippetSyntax.build.firstCall.args[1]).to.eql('/^abc "([^"]*)" ghi$/')
        expect(this.snippetSyntax.build.firstCall.args[2]).to.eql(['arg1', 'callback'])
      })
    })

    describe('step name has multiple quoted strings', function() {
      beforeEach(function() {
        this.step.getName.returns('abc "def" ghi "jkl" mno')
        this.result = this.snippetBuilder.build(this.step)
      })

      it('replaces the quoted strings with capture groups and adds parameters', function() {
        expect(this.snippetSyntax.build.firstCall.args[1]).to.eql('/^abc "([^"]*)" ghi "([^"]*)" mno$/')
        expect(this.snippetSyntax.build.firstCall.args[2]).to.eql(['arg1', 'arg2', 'callback'])
      })
    })

    describe('step name has a standalone number', function() {
      beforeEach(function() {
        this.step.getName.returns('abc 123 def')
        this.result = this.snippetBuilder.build(this.step)
      })

      it('replaces the number with a capture group and adds a parameter', function() {
        expect(this.snippetSyntax.build.firstCall.args[1]).to.eql('/^abc (\\d+) def$/')
        expect(this.snippetSyntax.build.firstCall.args[2]).to.eql(['arg1', 'callback'])
      })
    })

    describe('step has a data table argument', function() {
      beforeEach(function() {
        this.step.getArguments.returns([new DataTable({rows: []})])
        this.result = this.snippetBuilder.build(this.step)
      })

      it('passes table as a parameter', function() {
        expect(this.snippetSyntax.build.firstCall.args[2]).to.eql(['table', 'callback'])
      })
    })

    describe('step has a doc string argument', function() {
      beforeEach(function() {
        this.step.getArguments.returns([new DocString()])
        this.result = this.snippetBuilder.build(this.step)
      })

      it('passes table as a parameter', function() {
        expect(this.snippetSyntax.build.firstCall.args[2]).to.eql(['string', 'callback'])
      })
    })

    describe('step name has multiple quoted strings and a data table argument', function() {
      beforeEach(function() {
        this.step.getName.returns('abc "def" ghi "jkl" mno')
        this.step.getArguments.returns([new DataTable({rows: []})])
        this.result = this.snippetBuilder.build(this.step)
      })

      it('puts the table argument after the capture groups', function() {
        expect(this.snippetSyntax.build.firstCall.args[2]).to.eql(['arg1', 'arg2', 'table', 'callback'])
      })
    })
  })
})
