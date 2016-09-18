import figures from 'figures'
import getColorFns from '../../get_color_fns'
import PrettyFormatter from './pretty'
import Status from '../../status'
import SummaryFormatter from './summary'

describe('PrettyFormatter', function() {
  beforeEach(function() {
    this.output = ''
    const colorFns = getColorFns(false)
    const logFn = (data) => {
      this.output += data
    }
    this.prettyFormatter = new PrettyFormatter({
      colorFns,
      log: logFn
    })
    sinon.stub(SummaryFormatter.prototype, 'handleStepResult')
  })

  afterEach(function() {
    SummaryFormatter.prototype.handleStepResult.restore()
  })

  describe('before feature', function() {
    beforeEach(function(){
      this.feature = createMock({
        getKeyword: 'feature-keyword',
        getName: 'feature-name',
        getDescription: '',
        getTags: []
      })
    })

    describe('without tags or description', function() {
      beforeEach(function() {
        this.prettyFormatter.handleBeforeFeature(this.feature)
      })

      it('output the feature keyword and name', function() {
        expect(this.output).to.eql(
          'feature-keyword: feature-name\n' +
          '\n'
        )
      })
    })

    describe('with tags', function() {
      beforeEach(function() {
        this.feature.getTags.returns([
          createMock({getName: '@tagA'}),
          createMock({getName: '@tagB'})
        ])
        this.prettyFormatter.handleBeforeFeature(this.feature)
      })

      it('outputs the tags seperated by spaces above the keyword and name', function() {
        expect(this.output).to.eql(
          '@tagA @tagB\n' +
          'feature-keyword: feature-name\n' +
          '\n'
        )
      })
    })

    describe('with description', function() {
      beforeEach(function() {
        this.feature.getDescription.returns('line1\nline2')
        this.prettyFormatter.handleBeforeFeature(this.feature)
      })

      it('outputs the description below the keyword and name', function() {
        expect(this.output).to.eql(
          'feature-keyword: feature-name\n' +
          '\n' +
          '  line1\n' +
          '  line2\n' +
          '\n'
        )
      })
    })
  })

  describe('before scenario', function() {
    beforeEach(function(){
      this.scenario = createMock({
        getKeyword: 'scenario-keyword',
        getName: 'scenario-name',
        getTags: []
      })
    })

    describe('without tags or description', function() {
      beforeEach(function() {
        this.prettyFormatter.handleBeforeScenario(this.scenario)
      })

      it('output the scenario keyword and name', function() {
        expect(this.output).to.eql(
          '  scenario-keyword: scenario-name\n'
        )
      })
    })

    describe('with tags', function() {
      beforeEach(function() {
        this.scenario.getTags.returns([
          createMock({getName: '@tagA'}),
          createMock({getName: '@tagB'})
        ])
        this.prettyFormatter.handleBeforeScenario(this.scenario)
      })

      it('outputs the tags seperated by spaces above the keyword and name', function() {
        expect(this.output).to.eql(
          '  @tagA @tagB\n' +
          '  scenario-keyword: scenario-name\n'
        )
      })
    })
  })

  describe('step result', function() {
    beforeEach(function(){
      this.step = createMock({
        getArguments: [],
        getKeyword: 'step-keyword ',
        getName: 'step-name',
        isHidden: false
      })
      this.stepResult = createMock({
        getStatus: Status.PASSED,
        getStep: this.step
      })
    })

    describe('failed step', function () {
      beforeEach(function () {
        this.stepResult.getStatus.returns(Status.FAILED)
        this.prettyFormatter.handleStepResult(this.stepResult)
      })

      it('logs the keyword and name', function () {
        expect(this.output).to.eql(
          '  ' + figures.cross + ' step-keyword step-name\n'
        )
      })
    })

    describe('passed', function() {
      describe('without name', function() {
        beforeEach(function() {
          this.step.getName.returns(undefined)
          this.prettyFormatter.handleStepResult(this.stepResult)
        })

        it('logs the keyword', function () {
          expect(this.output).to.eql(
            '  ' + figures.tick + ' step-keyword \n'
          )
        })
      })

      describe('with name', function() {
        beforeEach(function() {
          this.prettyFormatter.handleStepResult(this.stepResult)
        })

        it('logs the keyword and name', function () {
          expect(this.output).to.eql(
            '  ' + figures.tick + ' step-keyword step-name\n'
          )
        })
      })

      describe('with data table', function () {
        beforeEach(function() {
          const raw = [
            ['cuk', 'cuke', 'cukejs'],
            ['c',   'cuke', 'cuke.js'],
            ['cu',  'cuke', 'cucumber']
          ]
          const dataTable = createMock({raw})
          dataTable.constructor = {name: 'DataTable'}
          this.step.getArguments.returns([dataTable])
          this.prettyFormatter.handleStepResult(this.stepResult)
        })

        it('logs the keyword and name and data table', function () {
          expect(this.output).to.eql(
            '  ' + figures.tick + ' step-keyword step-name\n' +
            '      | cuk | cuke | cukejs   |\n' +
            '      | c   | cuke | cuke.js  |\n' +
            '      | cu  | cuke | cucumber |\n'
          )
        })
      })

      describe('with doc string', function() {
        beforeEach(function () {
          const content = 'this is a multiline\ndoc string\n\n:-)'
          const docString = createMock({getContent: content})
          docString.constructor = {name: 'DocString'}
          this.step.getArguments.returns([docString])
          this.prettyFormatter.handleStepResult(this.stepResult)
        })

        it('logs the keyword and name and doc string', function () {
          expect(this.output).to.eql(
            '  ' + figures.tick + ' step-keyword step-name\n' +
            '      """\n' +
            '      this is a multiline\n' +
            '      doc string\n' +
            '\n' +
            '      :-)\n' +
            '      """\n'
          )
        })
      })
    })

    describe('pending', function () {
      beforeEach(function () {
        this.stepResult.getStatus.returns(Status.PENDING)
        this.prettyFormatter.handleStepResult(this.stepResult)
      })

      it('logs the keyword and name', function () {
        expect(this.output).to.eql(
          '  ? step-keyword step-name\n'
        )
      })
    })

    describe('skipped', function () {
      beforeEach(function () {
        this.stepResult.getStatus.returns(Status.SKIPPED)
        this.prettyFormatter.handleStepResult(this.stepResult)
      })

      it('logs the keyword and name', function () {
        expect(this.output).to.eql(
          '  - step-keyword step-name\n'
        )
      })
    })

    describe('undefined', function () {
      beforeEach(function () {
        this.stepResult.getStatus.returns(Status.UNDEFINED)
        this.prettyFormatter.handleStepResult(this.stepResult)
      })

      it('logs the keyword and name', function () {
        expect(this.output).to.eql(
          '  ? step-keyword step-name\n'
        )
      })
    })
  })

  describe('after scenario', function() {
    beforeEach(function(){
      this.prettyFormatter.handleAfterScenario(this.scenario)
    })

    it('logs a newline', function() {
      expect(this.output).to.eql('\n')
    })
  })
})
