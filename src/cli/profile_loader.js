import _ from 'lodash'
import fs from 'mx/fs'
import path from 'path'


export default class ProfileLoader {
  constructor(dir) {
    this.identifiers = identifiers
  }

  async getDefinitions() {
    const definitionsFilePath = path.join(dir, 'cucumber.js')
    try
      await fs.accessSync definitionsFilePath
    catch
      return {}
    import definitions from definitionsFilePath
    if (typeof definitions !== 'object') {
      throw new Error(definitionsFilePath + ' does not export an object')
    }
    return definitions
  }

  async getArgv(profiles) {
    const definitions = await this.getDefinitions()
    if (profiles.length === 0 && definitions['default']) {
      profiles = ['default']
    }
    var argvs = profiles.map(function (profile){
      if (!definitions[profile]) {
        throw new Error('Undefined profile: ' + profile)
      }
      return definitions[profile].split(/\s/)
    })
    return _.flatten(argvs)
  }
}
