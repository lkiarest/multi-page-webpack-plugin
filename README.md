# MultiPageWebpackPlugin

Automatically generate multiple entry html files in one project. An enhancement to WebpackHtmlPlugin.

### Install

```
npm install @qintx/multi-page-webpack-plugin
// or
yarn add @qintx/multi-page-webpack-plugin
```

### Usage

```
// webpack.conf.js
const MultiPageWebpackPlugin = require('multi-page-webpack-plugin')

{
    // ...
    // use this option just as a placeholder if there is no other entry.
    entry: MultiPageWebpackPlugin.ENTRY_NAME, 
    // remove HtmpWebpackPlugins and use options below instead.
    plugins: {
        // ... other plugins
        new MultiPageWebpackPlugin({
            // optional configs
        })
    }
    // ...
}

```

### Option

| name | default | description |
| :-: | :-: | :- | 
| entry | '**/entry.js' | specify the entry file rule via glob pattern |
| pageDir | 'src/pages' | the folder to search for page entries |
| output | '[entryName]/index.html' | output path, support variable '[entryName]' |
| template | 'index.html' | template file, support variable '[entryName]' |
| minify | false | minify the output file or not |
| commonChunks | [] | other common chunks like 'common', 'vendor' |
| debug | false | print debug infomation or not |


### Important

The webpack-dev-server cli will modify webpack config before the process of webpack. So we should use API mode of webpack-dev-server, below is an example:

```
// @file devServer.js
// -- run command 'node devServer.js'

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

require('./webpack.dev.conf').then(webpackConfig => {
    const compiler = Webpack(webpackConfig);
    const devServerOptions = Object.assign({}, webpackConfig.devServer, {
      stats: {
        colors: true
      }
    });

    const server = new WebpackDevServer(compiler, devServerOptions);

    server.listen(8080, '0.0.0.0', () => {
      console.log('Starting server on http://localhost:8080');
    });
});

```