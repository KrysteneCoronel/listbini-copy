module.exports = {
  preset: 'react-native',
  testPathIgnorePatterns: ['/node_modules/', '/supabase/functions/'],
  moduleNameMapper: {
    '^jsr:.*': '<rootDir>/__mocks__/empty.js',
    '^npm:.*': '<rootDir>/__mocks__/empty.js',
  },
};
