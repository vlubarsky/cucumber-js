import getColorFns from '../../get_color_fns'
import PrettyFormatter from './pretty'
import Status from '../../status'
import SummaryFormatter from './summary'
import DataTable from '../../models/step_arguments/data_table'
import DocString from '../../models/step_arguments/doc_string'

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
      this.feature = {
        getKeyword: sinon.stub().returns('feature-keyword'),
        getName: sinon.stub().returns('feature-name'),
        getDescription: sinon.stub(),
        getTags: sinon.stub().returns([])
      }
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
          {getName: sinon.stub().returns('@tagA')},
          {getName: sinon.stub().returns('@tagB')}
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
      this.scenario = {
        getKeyword: sinon.stub().returns('scenario-keyword'),
        getName: sinon.stub().returns('scenario-name'),
        getTags: sinon.stub().returns([])
      }
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
          {getName: sinon.stub().returns('@tagA')},
          {getName: sinon.stub().returns('@tagB')}
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
      this.step = {
        getArguments: sinon.stub().returns([]),
        getKeyword: sinon.stub().returns('step-keyword '),
        getName: sinon.stub().returns('step-name'),
        isHidden: sinon.stub().returns(false)
      }
      this.stepResult = {
        getStatus: sinon.stub().returns(Status.PASSED),
        getStep: sinon.stub().returns(this.step)
      }
    })

    describe('failed step', function () {
      beforeEach(function () {
        this.stepResult.getStatus.returns(Status.FAILED)
        this.prettyFormatter.handleStepResult(this.stepResult)
      })

      it('logs the keyword and name', function () {
        expect(this.output).to.eql(
          '  ✖ step-keyword step-name\n'
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
            '  ✔ step-keyword \n'
          )
        })
      })

      describe('with name', function() {
        beforeEach(function() {
          this.prettyFormatter.handleStepResult(this.stepResult)
        })

        it('logs the keyword and name', function () {
          expect(this.output).to.eql(
            '  ✔ step-keyword step-name\n'
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
          const rows = raw.map((row) => {
            return {
              cells: row.map((cell) => { return {value: cell} })
            }
          })
          const dataTable = new DataTable({rows})
          this.step.getArguments.returns([dataTable])
          this.prettyFormatter.handleStepResult(this.stepResult)
        })

        it('logs the keyword and name and data table', function () {
          expect(this.output).to.eql(
            '  ✔ step-keyword step-name\n' +
            '      | cuk | cuke | cukejs   |\n' +
            '      | c   | cuke | cuke.js  |\n' +
            '      | cu  | cuke | cucumber |\n'
          )
        })
      })

      describe('with doc string', function() {
        beforeEach(function () {
          const content = 'this is a multiline\ndoc string\n\n:-)'
          const docString = new DocString({content})
          this.step.getArguments.returns([docString])
          this.prettyFormatter.handleStepResult(this.stepResult)
        })

        it('logs the keyword and name and doc string', function () {
          expect(this.output).to.eql(
            '  ✔ step-keyword step-name\n' +
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



  // describe('step result', function() {
  //   beforeEach(function(){
  //     this.stepResult = {
  //       getStatus: sinon.stub()
  //     }
  //   })
  //   describe('passing', function() {
  //     beforeEach(function() {
  //       this.stepResult.getStatus.returns(Status.PASSED)
  //       this.progressFormatter.handleStepResult(this.stepResult)
  //     })
  //
  //     it('outputs a dot', function() {
  //       expect(this.output).to.eql('.')
  //     })
  //   })
  //
  //   describe('failing', function() {
  //     beforeEach(function() {
  //       this.stepResult.getStatus.returns(Status.FAILED)
  //       this.progressFormatter.handleStepResult(this.stepResult)
  //     })
  //
  //     it('outputs F', function() {
  //       expect(this.output).to.eql('F')
  //     })
  //   })
  //
  //   describe('ambiguous', function() {
  //     beforeEach(function() {
  //       this.stepResult.getStatus.returns(Status.AMBIGUOUS)
  //       this.progressFormatter.handleStepResult(this.stepResult)
  //     })
  //
  //     it('outputs A', function() {
  //       expect(this.output).to.eql('A')
  //     })
  //   })
  //
  //   describe('undefined', function() {
  //     beforeEach(function() {
  //       this.stepResult.getStatus.returns(Status.UNDEFINED)
  //       this.progressFormatter.handleStepResult(this.stepResult)
  //     })
  //
  //     it('outputs U', function() {
  //       expect(this.output).to.eql('U')
  //     })
  //   })
  //
  //   describe('pending', function() {
  //     beforeEach(function() {
  //       this.stepResult.getStatus.returns(Status.PENDING)
  //       this.progressFormatter.handleStepResult(this.stepResult)
  //     })
  //
  //     it('outputs P', function() {
  //       expect(this.output).to.eql('P')
  //     })
  //   })
  //
  //   describe('summary formatter', function() {
  //     beforeEach(function() {
  //       this.progressFormatter.handleStepResult(this.stepResult)
  //     })
  //
  //     it('handleStepResult is also called', function() {
  //       expect(SummaryFormatter.prototype.handleStepResult).to.have.been.calledOnce
  //       expect(SummaryFormatter.prototype.handleStepResult).to.have.been.calledWith(this.stepResult)
  //     })
  //   })
  // })
})
