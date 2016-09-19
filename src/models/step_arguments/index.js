export default class StepArguments {
  static build(gherkinData) {
    if (gherkinData.hasOwnProperty('content')) {
      return new DocString(gherkinData)
    } else if (gherkinData.hasOwnProperty('rows')) {
      return new DataTable(gherkinData)
    } else {
      throw new Error('Unknown step argument type: ' + JSON.stringify(gherkinData))
    }
  }
}
