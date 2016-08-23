import RerunFormatter from './rerun'
import Status from '../../status'

describe('RerunFormatter', function() {
  beforeEach(function() {
    this.output = ''
    const logFn = (data) => {
      this.output += data
    }
    this.rerunFormatter = new RerunFormatter({
      cwd: 'path/to/project',
      log: logFn
    })
  })

  describe('with no scenarios', function() {
    beforeEach(function() {
      this.rerunFormatter.handleAfterFeatures()
    })

    it('outputs nothing', function() {
      expect(this.output).to.eql('')
    })
  })

  describe('with one passing scenario', function() {
    beforeEach(function() {
      const scenarioResult = {
        getStatus: sinon.stub().returns(Status.PASSING)
      }
      this.rerunFormatter.handleScenarioResult(scenarioResult)
      this.rerunFormatter.handleAfterFeatures()
    })

    it('outputs nothing', function() {
      expect(this.output).to.eql('')
    })
  })

  describe('with one failing scenario', function() {
    beforeEach(function() {
      const scenario = {
        getLine: sinon.stub().returns(1),
        getUri: sinon.stub().returns('path/to/project/features/a.feature')
      }
      const scenarioResult = {
        getScenario: sinon.stub().returns(scenario),
        getStatus: sinon.stub().returns(Status.FAILED)
      }
      this.rerunFormatter.handleScenarioResult(scenarioResult)
      this.rerunFormatter.handleAfterFeatures()
    })

    it('outputs the reference needed to run the scenario again', function() {
      expect(this.output).to.eql('features/a.feature:1')
    })
  })

  describe('with two failing scenarios in the same file', function() {
    beforeEach(function() {
      const scenario1 = {
        getLine: sinon.stub().returns(1),
        getUri: sinon.stub().returns('path/to/project/features/a.feature')
      }
      const scenarioResult1 = {
        getScenario: sinon.stub().returns(scenario1),
        getStatus: sinon.stub().returns(Status.FAILED)
      }
      this.rerunFormatter.handleScenarioResult(scenarioResult1)
      const scenario2 = {
        getLine: sinon.stub().returns(2),
        getUri: sinon.stub().returns('path/to/project/features/a.feature')
      }
      const scenarioResult2 = {
        getScenario: sinon.stub().returns(scenario2),
        getStatus: sinon.stub().returns(Status.FAILED)
      }
      this.rerunFormatter.handleScenarioResult(scenarioResult2)
      this.rerunFormatter.handleAfterFeatures()
    })

    it('outputs the reference needed to run the scenarios again', function() {
      expect(this.output).to.eql('features/a.feature:1:2')
    })
  })

  describe('with two failing scenarios in different files', function() {
    beforeEach(function() {
      const scenario1 = {
        getLine: sinon.stub().returns(1),
        getUri: sinon.stub().returns('path/to/project/features/a.feature')
      }
      const scenarioResult1 = {
        getScenario: sinon.stub().returns(scenario1),
        getStatus: sinon.stub().returns(Status.FAILED)
      }
      this.rerunFormatter.handleScenarioResult(scenarioResult1)
      const scenario2 = {
        getLine: sinon.stub().returns(2),
        getUri: sinon.stub().returns('path/to/project/features/b.feature')
      }
      const scenarioResult2 = {
        getScenario: sinon.stub().returns(scenario2),
        getStatus: sinon.stub().returns(Status.FAILED)
      }
      this.rerunFormatter.handleScenarioResult(scenarioResult2)
      this.rerunFormatter.handleAfterFeatures()
    })

    it('outputs the references needed to run the scenarios again', function() {
      expect(this.output).to.eql(
        'features/a.feature:1\n' +
        'features/b.feature:2'
      )
    })
  })
})
