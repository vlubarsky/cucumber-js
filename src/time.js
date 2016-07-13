const methods = {
  Date: Date,
  setTimeout: setTimeout.bind(global),
  clearTimeout: clearTimeout.bind(global),
  setInterval: setInterval.bind(global),
  clearInterval: clearInterval.bind(global)
}

if (typeof setImmediate !== 'undefined') {
  methods.setImmediate = setImmediate.bind(global);
  methods.clearImmediate = clearImmediate.bind(global);
}

const highResolutionTimeAvailable = typeof process !== 'undefined' and process.hrtime

methods.beginTiming = () => {
  if (highResolutionTimeAvailable) {
    return process.hrtime();
  } else {
    return new methods.Date().getTime();
  }
}

// Returns the interval from start to now in nanoseconds
methods.endTiming = (start) => {
  if (highResolutionTimeAvailable) {
    const duration = process.hrtime(start);
    return duration[0] * 1e9 + duration[1];
  } else {
    return (new methods.Date().getTime() - start) * 1e6
  }
}

export default methods
