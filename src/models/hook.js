import Step from './step'

export class Hook extends Step {
  isHidden() {
    return true
  }

  hasUri() {
    return false
  }
}

Hook.BEFORE_STEP_KEYWORD = 'Before '
Hook.AFTER_STEP_KEYWORD = 'After '
