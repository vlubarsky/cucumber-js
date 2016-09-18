import _ from 'lodash'
import upperCaseFirst from 'upper-case-first'

const Status = {}

Status.AMBIGUOUS = 'ambiguous'
Status.FAILED = 'failed'
Status.PENDING = 'pending'
Status.PASSED = 'passed'
Status.SKIPPED = 'skipped'
Status.UNDEFINED = 'undefined'

const statuses = [
  Status.AMBIGUOUS,
  Status.FAILED,
  Status.PASSED,
  Status.PENDING,
  Status.SKIPPED,
  Status.UNDEFINED
]

Status.addPredicates = function addPredicates({getFn, protoype, prefix}) {
  _.each(statuses, (status) => {
    protoype[prefix + upperCaseFirst(status)] = function () {
      return this[getFn]() === status
    }
  })
}

Status.getMapping = function getMapping(initialValue) {
  return _.chain(statuses)
    .map((status) => [status, initialValue])
    .fromPairs()
    .value()
}

export default Status
