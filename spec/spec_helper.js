process.env.NODE_ENV = 'test'

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import "regenerator-runtime/runtime"

chai.use(sinonChai)

global.chai = chai
global.expect = chai.expect
global.sinon = sinon
