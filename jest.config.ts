export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.app.json'
    }
  },
  moduleNameMapper: {
    '^react$': 'react',
    '^react-dom$': 'react-dom'
  }
};
