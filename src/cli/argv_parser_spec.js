import ArgvParser from './argv_parser'
import tmp from 'tmp'
import {promisify} from 'bluebird'
import fs from 'mz/fs'
import path from 'path'

describe('ArgvParser', function() {
  describe('getUnexpandedFeaturePaths', function() {
    beforeEach(async function() {
      this.tmpDir = await promisify(tmp.dir)({unsafeCleanup: true})
      this.argv = ['/path/to/node', '/path/to/cucumber.js']
    })

    describe('with no arguments', function() {
      beforeEach(async function() {
        const argvParser = new ArgvParser({
          argv: this.argv,
          cwd: this.tmpDir
        })
        this.result = await argvParser.getUnexpandedFeaturePaths()
      })

      it('returns features', function() {
        expect(this.result).to.eql(['features'])
      })
    })

    describe('with files', function() {
      beforeEach(async function() {
        const argvParser = new ArgvParser({
          argv: this.argv.concat(['features/a.feature', 'features/b.feature']),
          cwd: this.tmpDir
        })
        this.result = await argvParser.getUnexpandedFeaturePaths()
      })

      it('returns the files', function() {
        expect(this.result).to.eql(['features/a.feature', 'features/b.feature'])
      })
    })

    describe('with a non-empty rerun file', function() {
      beforeEach(async function() {
        const argvParser = new ArgvParser({
          argv: this.argv.concat(['@rerun.txt']),
          cwd: this.tmpDir
        })
        const rerunPath = path.join(this.tmpDir, '@rerun.txt')
        await fs.writeFile(rerunPath, 'features/a.feature\nfeatures/b.feature')
        this.result = await argvParser.getUnexpandedFeaturePaths()
      })

      it('returns the feature paths in the rerun file', function() {
        expect(this.result).to.eql(['features/a.feature', 'features/b.feature'])
      })
    })

    describe('with a empty rerun file', function() {
      beforeEach(async function() {
        const argvParser = new ArgvParser({
          argv: this.argv.concat(['@rerun.txt']),
          cwd: this.tmpDir
        })
        const rerunPath = path.join(this.tmpDir, '@rerun.txt')
        await fs.writeFile(rerunPath, '')
        this.result = await argvParser.getUnexpandedFeaturePaths()
      })

      it('returns the feature paths in the rerun file', function() {
        expect(this.result).to.eql(['features'])
      })
    })

    describe('with a non-existing rerun file', function() {
      beforeEach(async function() {
        const argvParser = new ArgvParser({
          argv: this.argv.concat(['@rerun.txt']),
          cwd: this.tmpDir
        })
        try {
          await argvParser.getUnexpandedFeaturePaths()
        } catch(error) {
          this.error = error
        }
      })

      it('returns the feature paths in the rerun file', function() {
        expect(this.error).to.exist
        expect(this.error.message).to.include('ENOENT')
      })
    })
  })
})
