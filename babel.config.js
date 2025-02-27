module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-react', ['@babel/preset-env', {targets: {node: 'current'}}]],
    plugins: [
      'react-native-reanimated/plugin',
      '@babel/plugin-syntax-jsx'
    ],
  };
};
