import getColorFns from '../../get_color_fns'
import Status from '../../status'
import StepResult from '../../models/step_result'
import SummaryFormatter from './summary'

describe('SummaryFormatter', function() {
  beforeEach(function() {
    this.output = ''
    const logFn = (data) => {
      this.output += data
    }
    const colorFns = getColorFns(false)
    this.scenarioCounts = Status.getMapping(0)
    this.stepCounts = Status.getMapping(0)
    this.featuresResult = {
      getScenarioCounts: sinon.stub().returns(this.scenarioCounts),
      getStepCounts: sinon.stub().returns(this.stepCounts),
      getDuration: sinon.stub().returns(0)
    }
    const snippetBuilder = {
      build: sinon.stub().returns('snippet')
    }
    this.summaryFormatter = new SummaryFormatter({
      colorFns,
      cwd: 'path/to/project',
      log: logFn,
      snippetBuilder
    })
  })

  describe('issues', function() {
    beforeEach(function() {
      const scenario = {
        getLine: sinon.stub().returns(1),
        getName: sinon.stub().returns('name1'),
        getUri: sinon.stub().returns('path/to/project/a.feature')
      }
      this.step = {
        getKeyword: sinon.stub().returns('keyword '),
        getLine: sinon.stub().returns(2),
        getName: sinon.stub().returns('name2'),
        getScenario: sinon.stub().returns(scenario),
        getUri: sinon.stub().returns('path/to/project/a.feature'),
        hasUri: sinon.stub().returns(true)
      }
    })

    describe('with a failing step', function() {
      beforeEach(function() {
        const stepDefinition = {
          getLine: sinon.stub().returns(3),
          getUri: sinon.stub().returns('path/to/project/steps.js'),
        }
        const stepResult = new StepResult({
          duration: 0,
          failureException: 'error',
          status: Status.FAILED,
          step: this.step,
          stepDefinition
        })
        this.summaryFormatter.handleStepResult(stepResult)
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('logs the issue', function() {
        expect(this.output).to.contain(
          'Failures:\n' +
          '\n' +
          '1) Scenario: name1 - a.feature:1\n' +
          '   Step: keyword name2 - a.feature:2\n' +
          '   Step Definition: steps.js:3\n' +
          '   Message:\n' +
          '     error'
        )
      })
    })

    describe('with an ambiguous step', function() {
      beforeEach(function() {
        const stepDefinition1 = {
          getLine: sinon.stub().returns(3),
          getPattern: sinon.stub().returns('pattern1'),
          getUri: sinon.stub().returns('path/to/project/steps.js')
        }
        const stepDefinition2 = {
          getLine: sinon.stub().returns(4),
          getPattern: sinon.stub().returns('longer pattern2'),
          getUri: sinon.stub().returns('path/to/project/steps.js')
        }
        const stepResult = new StepResult({
          ambiguousStepDefinitions: [stepDefinition1, stepDefinition2],
          duration: 0,
          status: Status.AMBIGUOUS,
          step: this.step
        })
        this.summaryFormatter.handleStepResult(stepResult)
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('logs the issue', function() {
        expect(this.output).to.contain(
          'Failures:\n' +
          '\n' +
          '1) Scenario: name1 - a.feature:1\n' +
          '   Step: keyword name2 - a.feature:2\n' +
          '   Message:\n' +
          '     Multiple step definitions match:\n' +
          '       pattern1        - steps.js:3\n' +
          '       longer pattern2 - steps.js:4'
        )
      })
    })

    describe('with an undefined step', function() {
      beforeEach(function() {
        const stepResult = new StepResult({
          duration: 0,
          status: Status.UNDEFINED,
          step: this.step
        })
        this.summaryFormatter.handleStepResult(stepResult)
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('logs the issue', function() {
        expect(this.output).to.contain(
          'Warnings:\n' +
          '\n' +
          '1) Scenario: name1 - a.feature:1\n' +
          '   Step: keyword name2 - a.feature:2\n' +
          '   Message:\n' +
          '     Undefined. Implement with the following snippet:\n' +
          '\n' +
          '       snippet'
        )
      })
    })

    describe('with a pending step', function() {
      beforeEach(function() {
        const stepResult = new StepResult({
          duration: 0,
          status: Status.PENDING,
          step: this.step
        })
        this.summaryFormatter.handleStepResult(stepResult)
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('logs the issue', function() {
        expect(this.output).to.contain(
          'Warnings:\n' +
          '\n' +
          '1) Scenario: name1 - a.feature:1\n' +
          '   Step: keyword name2 - a.feature:2\n' +
          '   Message:\n' +
          '     Pending'
        )
      })
    })
  })

  describe('summary', function() {
    describe('with no features', function() {
      beforeEach(function() {
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('outputs step totals, scenario totals, and duration', function() {
        expect(this.output).to.contain(
          '0 scenarios\n' +
          '0 steps\n' +
          '0m00.000s\n'
        )
      })
    })

    describe('with one passing scenario', function() {
      beforeEach(function() {
        this.scenarioCounts[Status.PASSED] = 1
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('outputs step totals, scenario totals, and duration', function() {
        expect(this.output).to.contain(
          '1 scenario (1 passed)\n' +
          '0 steps\n' +
          '0m00.000s\n'
        )
      })
    })

    describe('with one of every kind of scenario', function() {
      beforeEach(function() {
        this.scenarioCounts[Status.AMBIGUOUS] = 1
        this.scenarioCounts[Status.FAILED] = 1
        this.scenarioCounts[Status.PENDING] = 1
        this.scenarioCounts[Status.PASSED] = 1
        this.scenarioCounts[Status.UNDEFINED] = 1
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('outputs step totals, scenario totals, and duration', function() {
        expect(this.output).to.contain(
          '5 scenarios (1 failed, 1 ambiguous, 1 undefined, 1 pending, 1 passed)\n' +
          '0 steps\n' +
          '0m00.000s\n'
        )
      })
    })

    describe('with one passing step', function() {
      beforeEach(function() {
        this.stepCounts[Status.PASSED] = 1
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('outputs step totals, scenario totals, and duration', function() {
        expect(this.output).to.contain(
          '0 scenarios\n' +
          '1 step (1 passed)\n' +
          '0m00.000s\n'
        )
      })
    })

    describe('with one of every kind of setp', function() {
      beforeEach(function() {
        this.stepCounts[Status.AMBIGUOUS] = 1
        this.stepCounts[Status.FAILED] = 1
        this.stepCounts[Status.PENDING] = 1
        this.stepCounts[Status.PASSED] = 1
        this.stepCounts[Status.UNDEFINED] = 1
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('outputs step totals, scenario totals, and duration', function() {
        expect(this.output).to.contain(
          '0 scenarios\n' +
          '5 steps (1 failed, 1 ambiguous, 1 undefined, 1 pending, 1 passed)\n' +
          '0m00.000s\n'
        )
      })
    })

    describe('with a duration of 123 nanoseconds', function() {
      beforeEach(function() {
        this.featuresResult.getDuration.returns(123)
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('outputs step totals, scenario totals, and duration', function() {
        expect(this.output).to.contain(
          '0 scenarios\n' +
          '0 steps\n' +
          '0m00.001s\n'
        )
      })
    })

    describe('with a duration of 123 milliseconds', function() {
      beforeEach(function() {
        this.featuresResult.getDuration.returns(123 * 1000 * 1000)
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('outputs step totals, scenario totals, and duration', function() {
        expect(this.output).to.contain(
          '0 scenarios\n' +
          '0 steps\n' +
          '0m00.123s\n'
        )
      })
    })

    describe('with a duration of 12.3 seconds', function() {
      beforeEach(function() {
        this.featuresResult.getDuration.returns(123 * 1000 * 1000 * 100)
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('outputs step totals, scenario totals, and duration', function() {
        expect(this.output).to.contain(
          '0 scenarios\n' +
          '0 steps\n' +
          '0m12.300s\n'
        )
      })
    })

    describe('with a duration of 120.3 seconds', function() {
      beforeEach(function() {
        this.featuresResult.getDuration.returns(123 * 1000 * 1000 * 1000)
        this.summaryFormatter.handleFeaturesResult(this.featuresResult)
      })

      it('outputs step totals, scenario totals, and duration', function() {
        expect(this.output).to.contain(
          '0 scenarios\n' +
          '0 steps\n' +
          '2m03.000s\n'
        )
      })
    })
  })
})
