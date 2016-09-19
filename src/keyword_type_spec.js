import KeywordType, {getKeywordType} from './keyword_type'

describe('KeywordType', function() {
  describe('constants', function() {
    it('exposes the proper constants', function() {
      expect(KeywordType).to.include.keys([
        'EVENT',
        'OUTCOME',
        'PRECONDITION'
      ])
    })
  })

  describe('getKeywordType()', function() {
    beforeEach(function() {
      this.language = 'en'
    })

    describe('keyword is Given', function(){
      beforeEach(function() {
        this.step = {keyword: 'Given '}
      })

      it('returns precondition', function() {
        expect(getKeywordType(this.step, this.language)).to.eql(KeywordType.PRECONDITION)
      })
    })

    describe('keyword is When', function(){
      beforeEach(function() {
        this.step = {keyword: 'When '}
      })

      it('returns event', function() {
        expect(getKeywordType(this.step, this.language)).to.eql(KeywordType.EVENT)
      })
    })

    describe('keyword is Then', function(){
      beforeEach(function() {
        this.step = {keyword: 'Then '}
      })

      it('returns outcome', function() {
        expect(getKeywordType(this.step, this.language)).to.eql(KeywordType.OUTCOME)
      })
    })

    describe('keyword is And, no previous step', function(){
      beforeEach(function() {
        this.step = {keyword: 'And '}
      })

      it('returns precondition', function() {
        expect(getKeywordType(this.step, this.language)).to.eql(KeywordType.PRECONDITION)
      })
    })

    describe('keyword is And, previous step keyword is Given', function(){
      beforeEach(function() {
        const previousStep = {keyword: 'Given '}
        this.step = {keyword: 'And ', previousStep}
      })

      it('returns precondition', function() {
        expect(getKeywordType(this.step, this.language)).to.eql(KeywordType.PRECONDITION)
      })
    })

    describe('keyword is But, no previous step', function(){
      beforeEach(function() {
        this.step = {keyword: 'But '}
      })

      it('returns precondition', function() {
        expect(getKeywordType(this.step, this.language)).to.eql(KeywordType.PRECONDITION)
      })
    })

    describe('keyword is But, previous step keyword is Then', function(){
      beforeEach(function() {
        const previousStep = {keyword: 'Then '}
        this.step = {keyword: 'But ', previousStep}
      })

      it('returns outcome', function() {
        expect(getKeywordType(this.step, this.language)).to.eql(KeywordType.OUTCOME)
      })
    })

    describe('keyword is unknown', function(){
      beforeEach(function() {
        this.step = {keyword: 'other'}
      })

      it('returns precondition', function() {
        expect(getKeywordType(this.step, this.language)).to.eql(KeywordType.PRECONDITION)
      })
    })
  })
})
