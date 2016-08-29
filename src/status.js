import _ from 'lodash'

const Status = {}

Status.AMBIGUOUS = 'ambiguous'
Status.FAILED = 'failed'
Status.PENDING = 'pending'
Status.PASSED = 'passed'
Status.SKIPPED = 'skipped'
Status.UNDEFINED = 'undefined'

Status.getMapping = function getMapping(initialValue) {
  const statuses = [
    Status.AMBIGUOUS,
    Status.FAILED,
    Status.PASSED,
    Status.PENDING,
    Status.SKIPPED,
    Status.UNDEFINED
  ]
  return _.chain(statuses)
    .map((status) => [status, initialValue])
    .fromPairs()
    .value()
}

export default Status
