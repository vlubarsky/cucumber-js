common = [
  '--strict',
  '--format progress',
  '--format pretty:pretty.txt',
  '--format progress:progress.txt',
  '--format summary:summary.txt',
  '--format rerun:@rerun.txt'
].join(' ')

module.exports = {
  'default': common,
  'es5': common + ' --tags ~@es6'
};
