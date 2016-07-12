import Configuration from './configuration'
import fs from 'mz/fs'
import tmp from 'tmp'
import path from 'path'
import {promisify} from 'bluebird'

describe('Configuration', function() {
  describe('getCompilerExtensions / getCompilerModules', function() {
    describe('no compilers', function() {
      beforeEach(function() {
        this.configuration = new Configuration({
          options: {
            compiler: []
          }
        })
      })

      it('returns empty arrays', function() {
        expect(this.configuration.getCompilerExtensions()).to.eql([])
        expect(this.configuration.getCompilerModules()).to.eql([])
      })
    })

    describe('one compiler', function() {
      beforeEach(function() {
        this.configuration = new Configuration({
          options: {
            compiler: ['js:babel-register']
          }
        })
      })

      it('returns the proper extensions and modules', function() {
        expect(this.configuration.getCompilerExtensions()).to.eql(['js'])
        expect(this.configuration.getCompilerModules()).to.eql(['babel-register'])
      })
    })
  })

  describe('getFeaturePaths', function() {
    describe('no arguments', function() {
      beforeEach(function() {
        this.configuration = new Configuration({
          args: []
        })
      })

      it('returns ["features"]', async function() {
        const featurePaths = await this.configuration.getFeaturePaths()
        expect(featurePaths).to.eql(['features'])
      })
    })

    describe('single argument', function() {
      describe('starting with a @', function() {
        beforeEach(async function() {
          const tmpDir = await promisify(tmp.dir)({unsafeCleanup: true})
          const fileContent = "features/a.feature\nfeatures/b.feature"
          await fs.writeFile(path.join(tmpDir, '@rerun.txt'), fileContent)
          this.configuration = new Configuration({
            args: ['@rerun.txt'],
            cwd: tmpDir
          })
        })

        it('returns ["features"]', async function() {
          const featurePaths = await this.configuration.getFeaturePaths()
          expect(featurePaths).to.eql(['features/a.feature', 'features/b.feature'])
        })
      })

      describe('not starting with a @', function() {
        beforeEach(function() {
          this.configuration = new Configuration({
            args: ['features/a.feature'],
          })
        })

        it('returns ["features"]', async function() {
          const featurePaths = await this.configuration.getFeaturePaths()
          expect(featurePaths).to.eql(['features/a.feature'])
        })
      })
    })
  })
})
