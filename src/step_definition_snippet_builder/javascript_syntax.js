export default {
  build(functionName, pattern, parameters, comment) {
    const callbackName = parameters[parameters.length - 1]
    const snippet =
      'this.' + functionName + '(' + pattern + ', function (' + parameters.join(', ') + ') {' + '\n' +
      '  // ' + comment + '\n' +
      '  ' + callbackName + '(null, \'pending\');\n' +
      '});'
    return snippet
  }
}
