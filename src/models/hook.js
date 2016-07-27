import Step from './step'

export default class Hook extends Step {
  isHidden() {
    return true
  }

  hasUri() {
    return false
  }
}

Hook.BEFORE_STEP_KEYWORD = 'Before '
Hook.AFTER_STEP_KEYWORD = 'After '
