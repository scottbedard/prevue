import * as chai from 'chai';
import chaiSubset = require('chai-subset');
import * as uglify from 'uglify-js';
import { lint } from '../src/utils/linter';

//
// object subset assertions
//
chai.use(chaiSubset);
