## Installation
```bash
# npm
npm install --save-dev webpack-component-override-plugin
# yarn
yarn add -D webpack-component-override-plugin
```
## Config
```js
// webpack.config.js
const ComponentOverridePlugin = require('webpack-component-override-plugin')
module.exports = {
  ...
  resolve: {
    plugins: [
      new ComponentOverridePlugin([
            {
              prefix: 'resources\\\\js\\\\components',
              directories: [
                path.resolve('resources/override/components'),
                path.resolve('resources/js/components')
              ]
            }
          ]
      )
    ]
  },
};
```
