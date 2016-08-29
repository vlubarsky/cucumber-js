import getColorFns from '../../get_color_fns'
import ProgressFormatter from './progress'
import Status from '../../status'
import SummaryFormatter from './summary'

describe('ProgressFormatter', function() {
  beforeEach(function() {
    this.output = ''
    const colorFns = getColorFns(false)
    const logFn = (data) => {
      this.output += data
    }
    this.progressFormatter = new ProgressFormatter({
      colorFns,
      log: logFn
    })
    sinon.stub(SummaryFormatter.prototype, 'handleStepResult')
    sinon.stub(SummaryFormatter.prototype, 'handleFeaturesResult')
  })

  afterEach(function() {
    SummaryFormatter.prototype.handleStepResult.restore()
    SummaryFormatter.prototype.handleFeaturesResult.restore()
  })

  describe('step resuls', function() {
    beforeEach(function(){
      this.stepResult = {
        getStatus: sinon.stub()
      }
    })
    describe('passing', function() {
      beforeEach(function() {
        this.stepResult.getStatus.returns(Status.PASSED)
        this.progressFormatter.handleStepResult(this.stepResult)
      })

      it('outputs a dot', function() {
        expect(this.output).to.eql('.')
      })
    })

    describe('failing', function() {
      beforeEach(function() {
        this.stepResult.getStatus.returns(Status.FAILED)
        this.progressFormatter.handleStepResult(this.stepResult)
      })

      it('outputs F', function() {
        expect(this.output).to.eql('F')
      })
    })

    describe('ambiguous', function() {
      beforeEach(function() {
        this.stepResult.getStatus.returns(Status.AMBIGUOUS)
        this.progressFormatter.handleStepResult(this.stepResult)
      })

      it('outputs A', function() {
        expect(this.output).to.eql('A')
      })
    })

    describe('undefined', function() {
      beforeEach(function() {
        this.stepResult.getStatus.returns(Status.UNDEFINED)
        this.progressFormatter.handleStepResult(this.stepResult)
      })

      it('outputs U', function() {
        expect(this.output).to.eql('U')
      })
    })

    describe('pending', function() {
      beforeEach(function() {
        this.stepResult.getStatus.returns(Status.PENDING)
        this.progressFormatter.handleStepResult(this.stepResult)
      })

      it('outputs P', function() {
        expect(this.output).to.eql('P')
      })
    })

    describe('summary formatter', function() {
      beforeEach(function() {
        this.progressFormatter.handleStepResult(this.stepResult)
      })

      it('handleStepResult is also called', function() {
        expect(SummaryFormatter.prototype.handleStepResult).to.have.been.calledOnce
        expect(SummaryFormatter.prototype.handleStepResult).to.have.been.calledWith(this.stepResult)
      })
    })
  })

  describe('features result', function() {
    beforeEach(function() {
      this.featuresResult = {some: 'data'}
      this.progressFormatter.handleFeaturesResult(this.featuresResult)
    })

    it('outputs two newlines to separate the step results from the summary output', function() {
      expect(this.output).to.eql('\n\n')
    })

    describe('summary formatter', function() {
      it('handleFeaturesResult is also called', function() {
        expect(SummaryFormatter.prototype.handleFeaturesResult).to.have.been.calledOnce
        expect(SummaryFormatter.prototype.handleFeaturesResult).to.have.been.calledWith(this.featuresResult)
      })
    })
  })
})
