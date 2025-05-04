export default {
  testEnvironment: 'node',
  transform: {},
  // No need to specify extensionsToTreatAsEsm since package.json has "type": "module"
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  verbose: true
};
