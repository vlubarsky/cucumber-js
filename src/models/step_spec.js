import Step from './step'
import DataTable from './step_arguments/data_table'
import DocString from './step_arguments/doc_string'
import KeywordType from '../keyword_type'

describe('Step', function () {
  describe('getArguments()', function () {
    describe('with content', function() {
      beforeEach(function() {
        this.step = new Step({arguments: [{content: 'data'}]})
      })

      it('returns a DocString', function () {
        const stepArguments = this.step.getArguments()
        expect(stepArguments).to.have.lengthOf(1)
        expect(stepArguments[0]).to.be.instanceOf(DocString)
        expect(stepArguments[0].getContent()).to.eql('data')
      })
    })

    describe('with rows', function() {
      beforeEach(function() {
        const rows = [
          {cells: [{value: 1}, {value: 2}]},
          {cells: [{value: 3}, {value: 4}]},
        ]
        this.step = new Step({arguments: [{rows}]})
      })

      it('returns a DataTable', function () {
        const stepArguments = this.step.getArguments()
        expect(stepArguments).to.have.lengthOf(1)
        expect(stepArguments[0]).to.be.instanceOf(DataTable)
        expect(stepArguments[0].raw()).to.eql([[1,2],[3,4]])
      })

    })

    describe('with unknown argument', function() {
      it('throws', function() {
        expect(function() {
          new Step({arguments: [{some: 'data'}]})
        }).to.throw('Unknown step argument type: {"some":"data"}')
      })
    })
  })

  describe('getKeyword()', function () {
    beforeEach(function() {
      const feature = {getStepKeywordByLines: sinon.stub()}
      feature.getStepKeywordByLines.withArgs([1,2]).returns('keyword')
      const scenario = {getFeature: sinon.stub()}
      scenario.getFeature.returns(feature)

      this.step = new Step({locations: [{line: 1}, {line: 2}]})
      this.step.setScenario(scenario)
    })

    it('returns the keyword by querying the feature', function () {
      expect(this.step.getKeyword()).to.eql('keyword')
    })
  })

  describe('getKeywordType()', function() {
    beforeEach(function() {
      this.feature = {
        getLanguage: sinon.stub(),
        getStepKeywordByLines: sinon.stub()
      }
      this.feature.getLanguage.returns('en')
      this.scenario = {getFeature: sinon.stub()}
      this.scenario.getFeature.returns(this.feature)
      this.step = new Step({locations: [{line: 2}]})
      this.step.setScenario(this.scenario)
    })

    describe('keyword is Given', function(){
      beforeEach(function() {
        this.feature.getStepKeywordByLines.withArgs([2]).returns('Given ')
      })

      it('returns precondition', function() {
        expect(this.step.getKeywordType()).to.eql(KeywordType.PRECONDITION)
      })
    })

    describe('keyword is When', function(){
      beforeEach(function() {
        this.feature.getStepKeywordByLines.withArgs([2]).returns('When ')
      })

      it('returns event', function() {
        expect(this.step.getKeywordType()).to.eql(KeywordType.EVENT)
      })
    })

    describe('keyword is Then', function(){
      beforeEach(function() {
        this.feature.getStepKeywordByLines.withArgs([2]).returns('Then ')
      })

      it('returns outcome', function() {
        expect(this.step.getKeywordType()).to.eql(KeywordType.OUTCOME)
      })
    })

    describe('keyword is And, no previous step', function(){
      beforeEach(function() {
        this.feature.getStepKeywordByLines.withArgs([2]).returns('And ')
      })

      it('returns precondition', function() {
        expect(this.step.getKeywordType()).to.eql(KeywordType.PRECONDITION)
      })
    })

    describe('keyword is And, previous step keyword is Given', function(){
      beforeEach(function() {
        const previousStep = new Step({locations: [{line: 1}]})
        previousStep.setScenario(this.scenario)
        this.feature.getStepKeywordByLines.withArgs([1]).returns('Given ')
        this.feature.getStepKeywordByLines.withArgs([2]).returns('And ')
        this.step.setPreviousStep(previousStep)
      })

      it('returns precondition', function() {
        expect(this.step.getKeywordType()).to.eql(KeywordType.PRECONDITION)
      })
    })

    describe('keyword is But, no previous step', function(){
      beforeEach(function() {
        this.feature.getStepKeywordByLines.withArgs([2]).returns('But ')
      })

      it('returns precondition', function() {
        expect(this.step.getKeywordType()).to.eql(KeywordType.PRECONDITION)
      })
    })

    describe('keyword is But, previous step keyword is Then', function(){
      beforeEach(function() {
        const previousStep = new Step({locations: [{line: 1}]})
        previousStep.setScenario(this.scenario)
        this.feature.getStepKeywordByLines.withArgs([1]).returns('Then ')
        this.feature.getStepKeywordByLines.withArgs([2]).returns('But ')
        this.step.setPreviousStep(previousStep)
      })

      it('returns outcome', function() {
        expect(this.step.getKeywordType()).to.eql(KeywordType.OUTCOME)
      })
    })

    describe('keyword is unknown', function(){
      beforeEach(function() {
        this.feature.getStepKeywordByLines.withArgs([2]).returns('other')
      })

      it('returns precondition', function() {
        expect(this.step.getKeywordType()).to.eql(KeywordType.PRECONDITION)
      })
    })
  })

  describe('getLine()', function () {
    beforeEach(function() {
      this.step = new Step({locations: [{line: 1}, {line: 2}]})
    })

    it('returns the last line number', function () {
      expect(this.step.getLine()).to.eql(2)
    })
  })

  describe('getLines()', function () {
    beforeEach(function() {
      this.step = new Step({locations: [{line: 1}, {line: 2}]})
    })

    it('returns all the line numbers', function () {
      expect(this.step.getLines()).to.eql([1,2])
    })
  })

  describe('getName()', function () {
    beforeEach(function() {
      this.step = new Step({text: 'text'})
    })

    it('returns the text', function () {
      expect(this.step.getName()).to.eql('text')
    })
  })

  describe('getScenario() / setScenario(value)', function () {
    beforeEach(function() {
      this.scenario = {scenario: 'data'}
      this.step = new Step({})
      this.step.setScenario(this.scenario)
    })

    it('returns the set scenario', function () {
      this.step.getScenario()
      expect(this.step.getScenario()).to.eql(this.scenario)
    })
  })

  describe('getUri()', function () {
    beforeEach(function() {
      this.step = new Step({locations: [{path: 'path1'}, {path: 'path2'}]})
    })

    it('returns the first path', function () {
      expect(this.step.getUri()).to.eql('path1')
    })
  })

  describe('hasUri()', function () {
    beforeEach(function() {
      this.step = new Step({})
    })

    it('returns true', function () {
      expect(this.step.hasUri()).to.be.true
    })
  })

  describe('isHidden()', function () {
    beforeEach(function() {
      this.step = new Step({})
    })

    it('returns false', function () {
      expect(this.step.isHidden()).to.be.false
    })
  })
})
