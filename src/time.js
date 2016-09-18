const methods = {
  Date,
  setTimeout: setTimeout.bind(global),
  clearTimeout: clearTimeout.bind(global),
  setInterval: setInterval.bind(global),
  clearInterval: clearInterval.bind(global)
}

if (typeof setImmediate !== 'undefined') {
  methods.setImmediate = setImmediate.bind(global)
  methods.clearImmediate = clearImmediate.bind(global)
}


function getTimestamp() {
  return new methods.Date().getTime()
}

let previousTimestamp

methods.beginTiming = () => {
  previousTimestamp = getTimestamp()
}

// Returns the interval from the previous call of beginTiming() to now in milliseconds
methods.endTiming = () => {
  return (getTimestamp() - previousTimestamp)
}

export default methods
