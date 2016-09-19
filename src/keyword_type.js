import _ from 'lodash'
import Gherkin from 'gherkin'

const types = {
  EVENT: 'event',
  OUTCOME: 'outcome',
  PRECONDITION: 'precondition'
}

export default types

export function getKeywordType(step, language) {
  const dialect = Gherkin.DIALECTS[language]
  const type = _.find(['given', 'when', 'then', 'and', 'but'], (type) => {
    return _.includes(dialect[type], step.keyword)
  })
  switch(type) {
    case 'when':
      return types.EVENT
    case 'then':
      return types.OUTCOME
    case 'and':
    case 'but':
      if (step.previousStep) {
        return getKeywordType(step.previousStep, language)
      }
      // fallthrough
    default:
      return types.PRECONDITION
  }
}
