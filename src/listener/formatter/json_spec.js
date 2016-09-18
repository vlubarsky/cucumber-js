import JsonFormatter from './json'
import Status from '../../status'

describe('JsonFormatter', function () {
  beforeEach(function () {
    this.output = ''
    const logFn = (data) => {
      this.output += data
    }
    this.jsonFormatter = new JsonFormatter({log: logFn})
  })

  describe('no features', function () {
    beforeEach(function () {
      this.jsonFormatter.handleAfterFeatures()
    })

    it('outputs an empty array', function () {
      expect(JSON.parse(this.output)).to.eql([])
    })
  })

  describe('one feature', function() {
    beforeEach(function () {
      const tag1 = createMock({getName: 'tag 1', getLine: 1})
      const tag2 = createMock({getName: 'tag 2', getLine: 1})
      const feature = createMock({
        getKeyword: 'Feature',
        getName: 'A Feature Name',
        getDescription: 'A Feature Description',
        getLine: 2,
        getUri: 'uri',
        getTags: [tag1, tag2]
      })
      this.jsonFormatter.handleBeforeFeature(feature)
    })

    describe('with no scenarios', function () {
      beforeEach(function () {
        this.jsonFormatter.handleAfterFeatures()
      })

      it('outputs the feature', function () {
        expect(JSON.parse(this.output)).to.eql([{
          description: 'A Feature Description',
          elements: [],
          id: 'a-feature-name',
          keyword: 'Feature',
          line: 2,
          name: 'A Feature Name',
          tags: [
            {name: 'tag 1', line: 1},
            {name: 'tag 2', line: 1},
          ],
          uri: 'uri'
        }])
      })
    })

    describe('with a scenario', function () {
      beforeEach(function () {
        var tag1 = createMock({getName: 'tag 1', getLine: 3})
        var tag2 = createMock({getName: 'tag 2', getLine: 3})
        var scenario = createMock({
          getKeyword: 'Scenario',
          getName: 'A Scenario Name',
          getDescription: 'A Scenario Description',
          getLine: 4,
          getTags: [tag1, tag2]
        })
        this.jsonFormatter.handleBeforeScenario(scenario)
      })

      describe('with no steps', function () {
        beforeEach(function () {
          this.jsonFormatter.handleAfterFeatures()
        })

        it('outputs the feature and the scenario', function () {
          const features = JSON.parse(this.output)
          expect(features[0].elements).to.eql([{
            description: 'A Scenario Description',
            id: 'a-feature-name;a-scenario-name',
            keyword: 'Scenario',
            line: 4,
            name: 'A Scenario Name',
            steps: [],
            tags: [
              {name: 'tag 1', line: 3},
              {name: 'tag 2', line: 3}
            ],
            type: 'scenario'
          }])
        })
      })

      describe('with a step', function () {
        beforeEach(function() {
          this.step = createMock({
            getArguments: [],
            getLine: 1,
            getKeyword: 'Step',
            getName: 'A Step Name',
            isHidden: false
          })

          this.stepResult = createMock({
            getDuration: 1,
            getFailureException: null,
            getStatus: Status.PASSED,
            getStep: this.step,
            getStepDefinition: null,
            hasAttachments: false,
            getAttachments: []
          })
        })

        describe('that is passing', function () {
          beforeEach(function() {
            this.jsonFormatter.handleStepResult(this.stepResult)
            this.jsonFormatter.handleAfterFeatures()
          })

          it('outputs the step', function () {
            const features = JSON.parse(this.output)
            expect(features[0].elements[0].steps).to.eql([{
              arguments: [],
              line: 1,
              keyword: 'Step',
              name: 'A Step Name',
              result: {
                status: 'passed',
                duration: 1
              }
            }])
          })
        })

        describe('that is failing', function () {
          beforeEach(function() {
            this.stepResult.getStatus.returns(Status.FAILED)
            this.stepResult.getFailureException.returns({stack: 'failure stack'})
            this.jsonFormatter.handleStepResult(this.stepResult)
            this.jsonFormatter.handleAfterFeatures()
          })

          it('outputs the step with the error message', function () {
            const features = JSON.parse(this.output)
            expect(features[0].elements[0].steps[0].result).to.eql({
              status: 'failed',
              error_message: 'failure stack',
              duration: 1
            })
          })
        })

        describe('that is hidden', function () {
          beforeEach(function() {
            this.step.isHidden.returns(true)
            this.jsonFormatter.handleStepResult(this.stepResult)
            this.jsonFormatter.handleAfterFeatures({})
          })

          it('does not output a line attribute and outputs a hidden attribute', function () {
            const features = JSON.parse(this.output)
            const step = features[0].elements[0].steps[0]
            expect(step).to.not.have.ownProperty('line')
            expect(step.hidden).to.be.true
          })
        })

        describe('with a doc string', function () {
          beforeEach(function (){
            const docString = createMock({
              getContent: 'This is a DocString',
              getLine: 2,
              getContentType: null,
            })
            docString.constructor = {name: 'DocString'}
            this.step.getArguments.returns([docString])
            this.jsonFormatter.handleStepResult(this.stepResult)
            this.jsonFormatter.handleAfterFeatures({})
          })

          it('outputs the doc string as a step argument', function () {
            const features = JSON.parse(this.output)
            expect(features[0].elements[0].steps[0].arguments).to.eql([{
              line: 2,
              content: 'This is a DocString',
              contentType: null
            }])
          })
        })

        describe('with a data table', function () {
          beforeEach(function (){
            const dataTable = createMock({
              raw: [
                ['a:1', 'a:2', 'a:3'],
                ['b:1', 'b:2', 'b:3'],
                ['c:1', 'c:2', 'c:3']
              ]
            })
            dataTable.constructor = {name: 'DataTable'}
            this.step.getArguments.returns([dataTable])
            this.jsonFormatter.handleStepResult(this.stepResult)
            this.jsonFormatter.handleAfterFeatures()
          })

          it('outputs the step with a hidden attribute', function () {
            const features = JSON.parse(this.output)
            expect(features[0].elements[0].steps[0].arguments).to.eql([{
              rows: [
                {cells: ['a:1', 'a:2', 'a:3']},
                {cells: ['b:1', 'b:2', 'b:3']},
                {cells: ['c:1', 'c:2', 'c:3']}
              ]
            }])
          })
        })

        describe('with attachments', function () {
          beforeEach(function (){
            const attachment1 = createMock({
              getMimeType: 'first mime type',
              getData: 'first data'
            })
            const attachment2 = createMock({
              getMimeType: 'second mime type',
              getData: 'second data'
            })
            this.stepResult.getAttachments.returns([attachment1, attachment2])
            this.jsonFormatter.handleStepResult(this.stepResult)
            this.jsonFormatter.handleAfterFeatures({})
          })

          it('outputs the step with a hidden attribute', function () {
            const features = JSON.parse(this.output)
            expect(features[0].elements[0].steps[0].embeddings).to.eql([
              {data: 'first data', mime_type: 'first mime type'},
              {data: 'second data', mime_type: 'second mime type'},
            ])
          })
        })

        describe('with a step definition', function () {
          beforeEach(function (){
            const stepDefinition = createMock({
              getLine: 2,
              getUri: 'path/to/stepDef'
            })
            this.stepResult.getStepDefinition.returns(stepDefinition)
            this.jsonFormatter.handleStepResult(this.stepResult)
            this.jsonFormatter.handleAfterFeatures({})
          })

          it('outputs the step with a match attribute', function () {
            var features = JSON.parse(this.output)
            expect(features[0].elements[0].steps[0].match).to.eql({
              location: 'path/to/stepDef:2'
            })
          })
        })
      })
    })
  })
})
