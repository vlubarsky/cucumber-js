import Step from './step'

export default class Hook extends Step {
  getKeyword() {
    return this.data.keyword
  }

  hasUri() {
    return false
  }

  isHidden() {
    return true
  }
}

Hook.BEFORE_STEP_KEYWORD = 'Before '
Hook.AFTER_STEP_KEYWORD = 'After '
