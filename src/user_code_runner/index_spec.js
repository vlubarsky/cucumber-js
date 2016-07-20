import UserCodeRunner from './'

describe('UserCodeRunner', function () {
  describe('run()', function () {
    beforeEach(function() {
      this.options = {
        argsArray: [],
        thisArg: {},
        timeoutInMilliseconds: 100
      }
    })

    describe("function uses synchronous interface", function() {
      describe("function throws", function() {
        describe('error object', function() {
          beforeEach(function() {
            this.options.fn = function() { throw 'error' }
          })

          it('returns the error', async function () {
            try {
              await UserCodeRunner.run(this.options)
            } catch (error) {
              expect(error).to.eql('error')
              return
            }
            throw new Error('expected error but none was thrown')
          })
        })

        describe('non-serializable object', function() {
          beforeEach(function() {
            const error = {}
            error.error = error
            this.options.fn = function() { throw error }
          })

          it('returns the error', async function () {
            try {
              await UserCodeRunner.run(this.options)
            } catch (error) {
              expect(error).to.eql('{ error: [Circular] }')
              return
            }
            throw new Error('expected error but none was thrown')
          })
        })
      })

      describe("function does not throws", function() {
        beforeEach(function() {
          this.options.fn = function() { return 'result' }
        })

        it('returns the return value of the function', async function () {
          const result = await UserCodeRunner.run(this.options)
          expect(result).to.eql('result')
        })
      })
    })

    describe("function uses asynchronous callback interface", function() {
      // describe("function throws", function() {
      //   beforeEach(function() {
      //     this.options.fn = function(callback) {
      //       setTimeout(function(){ throw 'error' }, 25)
      //       setTimeout(function(){ callback() }, 50)
      //     }
      //   })
      //
      //   it('returns the error', async function () {
      //     try {
      //       await UserCodeRunner.run(this.options)
      //     } catch (error) {
      //       expect(error).to.eql('error')
      //       return
      //     }
      //     throw new Error('expected error but none was thrown')
      //   })
      // })

      describe("function calls back with error", function() {
        beforeEach(function() {
          this.options.fn = function(callback) {
            setTimeout(function(){ callback('error') }, 25)
          }
        })

        it('returns the error', async function () {
          try {
            await UserCodeRunner.run(this.options)
          } catch (error) {
            expect(error).to.eql('error')
            return
          }
          throw new Error('expected error but none was thrown')
        })
      })

      describe("function calls back without error", function() {
        beforeEach(function() {
          this.options.fn = function(callback) {
            setTimeout(function(){ callback(null, 'result') }, 25)
          }
        })

        it('returns the what the function calls back with', async function () {
          const result = await UserCodeRunner.run(this.options)
          expect(result).to.eql('result')
        })
      })

      describe("function times out", function() {
        beforeEach(function() {
          this.options.fn = function(callback) {
            setTimeout(function(){ callback(null, 'result') }, 200)
          }
        })

        it('returns timeout as an error', async function () {
          try {
            await UserCodeRunner.run(this.options)
          } catch (error) {
            expect(error).to.eql('function timed out after 100 milliseconds')
            return
          }
          throw new Error('expected error but none was thrown')
        })
      })

      describe("function also returns a promise", function() {
        beforeEach(function() {
          this.options.fn = function(callback) {
            return {
              then: function() { callback() }
            }
          }
        })

        it('returns an error that only one interface should be used', async function () {
          try {
            await UserCodeRunner.run(this.options)
          } catch (error) {
            expect(error).to.eql('function accepts a callback and returns a promise')
            return
          }
          throw new Error('expected error but none was thrown')
        })
      })
    })

    describe("function uses promise interface", function() {
      // describe("function throws", function() {
      //   beforeEach(function() {
      //     fn = function() {
      //       return {
      //         then: function() {
      //           setTimeout(function(){ throw 'error' }, 25)
      //         }
      //       }
      //     }
      //   })
      //
      //   it('returns the error', function (done) {
      //     Cucumber.Util.run(fn, thisArg, argsArray, timeoutInMilliseconds, function(error, result) {
      //       expect(error).to.eql('error')
      //       expect(result).toBeUndefined()
      //       done()
      //     })
      //   })
      // })

      describe("promise resolves", function() {
        beforeEach(function() {
          this.options.fn = function() {
            return {
              then: function(resolve) {
                setTimeout(function(){ resolve('result') }, 25)
              }
            }
          }
        })

        it('returns what the promise resolves to', async function () {
          const result = await UserCodeRunner.run(this.options)
          expect(result).to.eql('result')
        })
      })

      describe("promise rejects with reason", function() {
        beforeEach(function() {
          this.options.fn = function() {
            return {
              then: function(resolve, reject) {
                setTimeout(function(){ reject('error') }, 25)
              }
            }
          }
        })

        it('returns what the promise rejects as an error', async function () {
          try {
            await UserCodeRunner.run(this.options)
          } catch (error) {
            expect(error).to.eql('error')
            return
          }
          throw new Error('expected error but none was thrown')
        })
      })

      describe("promise rejects without reason", function() {
        beforeEach(function() {
          this.options.fn = function() {
            return {
              then: function(resolve, reject) {
                setTimeout(function(){ reject() }, 25)
              }
            }
          }
        })

        it('returns "promise rejected" as an error', async function () {
          try {
            await UserCodeRunner.run(this.options)
          } catch (error) {
            expect(error).to.eql('Promise rejected without an error')
            return
          }
          throw new Error('expected error but none was thrown')
        })
      })

      describe("function times out", function() {
        beforeEach(function() {
          this.options.fn = function() {
            return {
              then: function(resolve) {
                setTimeout(function(){ resolve('result') }, 200)
              }
            }
          }
        })

        it('returns timeout as an error', async function () {
          try {
            await UserCodeRunner.run(this.options)
          } catch (error) {
            expect(error).to.eql('function timed out after 100 milliseconds')
            return
          }
          throw new Error('expected error but none was thrown')
        })
      })
    })
  })
})
