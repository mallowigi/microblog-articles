/* eslint-disable import/no-extraneous-dependencies */
const { defaults: tsjPreset } = require('ts-jest/presets');

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');
require('dotenv').config();

module.exports = {
  rootDir: '.',
  setupFiles: ['dotenv/config'],
  testRegex: '.spec.ts$',
  transform: {
    ...tsjPreset.transform,
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  testEnvironment: 'node',
};
