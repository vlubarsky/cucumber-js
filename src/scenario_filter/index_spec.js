import ScenarioFilter from './'

describe('ScenarioFilter', function() {
  describe('matches', function() {
    beforeEach(function() {
      this.scenario = {
        getLines: sinon.stub().returns([]),
        getName: sinon.stub().returns(''),
        getTags: sinon.stub().returns([]),
        getUri: sinon.stub().returns('')
      }
    })

    describe('no filters', function() {
      beforeEach(function() {
        this.scenarioFilter = new ScenarioFilter({
          featurePaths: ['features'],
          names: [],
          tagExpressions: []
        })
      })

      it('returns true', function() {
        expect(this.scenarioFilter.matches(this.scenario)).to.be.true
      })
    })

    describe('line filters', function() {
      beforeEach(function() {
        this.scenarioFilter = new ScenarioFilter({
          featurePaths: ['a.feature', 'b.feature:1:2'],
          names: [],
          tagExpressions: []
        })
      })

      describe('scenario in feature without line specified', function() {
        beforeEach(function() {
          this.scenario.getUri.returns('a.feature')
        })

        it('returns true', function() {
          expect(this.scenarioFilter.matches(this.scenario)).to.be.true
        })
      })

      describe('scenario in feature with line specified', function() {
        beforeEach(function() {
          this.scenario.getUri.returns('b.feature')
        })

        describe('scenario line matches', function() {
          beforeEach(function() {
            this.scenario.getLines.returns([1])
          })

          it('returns true', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.true
          })
        })

        describe('scenario line does not match', function() {
          beforeEach(function() {
            this.scenario.getLines.returns([3])
          })

          it('returns false', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.false
          })
        })
      })
    })

    describe('name filters', function() {
      describe('should match name A', function() {
        beforeEach(function() {
          this.scenarioFilter = new ScenarioFilter({
            featurePaths: ['features'],
            names: ['nameA'],
            tagExpressions: []
          })
        })

        describe('scenario name matches A', function() {
          beforeEach(function() {
            this.scenario.getName.returns('nameA descriptionA')
          })

          it('returns true', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.true
          })
        })

        describe('scenario name does not match A', function() {
          beforeEach(function() {
            this.scenario.getName.returns('nameB descriptionB')
          })

          it('returns false', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.false
          })
        })
      })

      describe('should match name A or B', function() {
        beforeEach(function() {
          this.scenarioFilter = new ScenarioFilter({
            featurePaths: ['features'],
            names: ['nameA', 'nameB'],
            tagExpressions: []
          })
        })

        describe('scenario name matches A', function() {
          beforeEach(function() {
            this.scenario.getName.returns('nameA descriptionA')
          })

          it('returns true', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.true
          })
        })

        describe('scenario name matches B', function() {
          beforeEach(function() {
            this.scenario.getName.returns('nameB descriptionB')
          })

          it('returns true', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.true
          })
        })

        describe('scenario name does not match A or B', function() {
          beforeEach(function() {
            this.scenario.getName.returns('nameC descriptionC')
          })

          it('returns false', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.false
          })
        })
      })
    })

    describe('tag filters', function() {
      describe('should have tag A', function() {
        beforeEach(function() {
          this.scenarioFilter = new ScenarioFilter({
            featurePaths: ['features'],
            names: [],
            tagExpressions: ['@tagA']
          })
        })

        describe('scenario has tag A', function() {
          beforeEach(function() {
            this.scenario.getTags.returns([
              {getName() { return '@tagA'}}
            ])
          })

          it('returns true', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.true
          })
        })

        describe('scenario does not have tag A', function() {
          it('returns false', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.false
          })
        })
      })

      describe('should not have tag A', function() {
        beforeEach(function() {
          this.scenarioFilter = new ScenarioFilter({
            featurePaths: ['features'],
            names: [],
            tagExpressions: ['~@tagA']
          })
        })

        describe('scenario has tag A', function() {
          beforeEach(function() {
            this.scenario.getTags.returns([
              {getName() { return '@tagA'}}
            ])
          })

          it('returns false', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.false
          })
        })

        describe('scenario does not have tag A', function() {
          it('returns true', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.true
          })
        })
      })

      describe('should have tag A and B', function() {
        beforeEach(function() {
          this.scenarioFilter = new ScenarioFilter({
            featurePaths: ['features'],
            names: [],
            tagExpressions: ['@tagA', '@tagB']
          })
        })

        describe('scenario has tag A and B', function() {
          beforeEach(function() {
            this.scenario.getTags.returns([
              {getName() { return '@tagA'}},
              {getName() { return '@tagB'}}
            ])
          })

          it('returns true', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.true
          })
        })

        describe('scenario has tag A, but not B', function() {
          beforeEach(function() {
            this.scenario.getTags.returns([
              {getName() { return '@tagA'}}
            ])
          })

          it('returns false', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.false
          })
        })

        describe('scenario has tag B, but not A', function() {
          beforeEach(function() {
            this.scenario.getTags.returns([
              {getName() { return '@tagB'}}
            ])
          })

          it('returns false', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.false
          })
        })

        describe('scenario does have tag A or B', function() {
          it('returns false', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.false
          })
        })
      })

      describe('should have tag A or B', function() {
        beforeEach(function() {
          this.scenarioFilter = new ScenarioFilter({
            featurePaths: ['features'],
            names: [],
            tagExpressions: ['@tagA,@tagB']
          })
        })

        describe('scenario has tag A and B', function() {
          beforeEach(function() {
            this.scenario.getTags.returns([
              {getName() { return '@tagA'}},
              {getName() { return '@tagB'}}
            ])
          })

          it('returns true', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.true
          })
        })

        describe('scenario has tag A, but not B', function() {
          beforeEach(function() {
            this.scenario.getTags.returns([
              {getName() { return '@tagA'}}
            ])
          })

          it('returns true', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.true
          })
        })

        describe('scenario has tag B, but not A', function() {
          beforeEach(function() {
            this.scenario.getTags.returns([
              {getName() { return '@tagB'}}
            ])
          })

          it('returns true', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.true
          })
        })

        describe('scenario does have tag A or B', function() {
          it('returns false', function() {
            expect(this.scenarioFilter.matches(this.scenario)).to.be.false
          })
        })
      })
    })

    describe('line, name, and tag filters', function() {
      describe('scenario matches all filters', function() {
        beforeEach(function() {
          this.scenarioFilter = new ScenarioFilter({
            featurePaths: ['b.feature:1:2'],
            names: ['nameA'],
            tagExpressions: ['@tagA']
          })
          this.scenario.getLines.returns([1])
          this.scenario.getName.returns('nameA descriptionA')
          this.scenario.getTags.returns([
            {getName() {return '@tagA'}}
          ])
          this.scenario.getUri.returns('b.feature')
        })

        it('returns true', function() {
          expect(this.scenarioFilter.matches(this.scenario)).to.be.true
        })
      })

      describe('scenario matches some filters', function() {
        beforeEach(function() {
          this.scenarioFilter = new ScenarioFilter({
            featurePaths: ['b.feature:1:2'],
            names: ['nameA'],
            tagExpressions: ['tagA']
          })
          this.scenario.getLines.returns([1])
          this.scenario.getUri.returns('b.feature')
        })

        it('returns false', function() {
          expect(this.scenarioFilter.matches(this.scenario)).to.be.false
        })
      })

      describe('scenario matches no filters', function() {
        beforeEach(function() {
          this.scenarioFilter = new ScenarioFilter({
            featurePaths: ['b.feature:1:2'],
            names: ['nameA'],
            tagExpressions: ['@tagA']
          })
          this.scenario.getLines.returns([3])
          this.scenario.getUri.returns('b.feature')
        })

        it('returns false', function() {
          expect(this.scenarioFilter.matches(this.scenario)).to.be.false
        })
      })
    })
  })
})
