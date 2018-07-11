# MultiPageWebpackPlugin

Automatically generate multiple entry html files in one project. An enhancement to WebpackHtmlPlugin.

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
