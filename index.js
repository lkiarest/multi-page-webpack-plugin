const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const addDevServerEntrypoints = require('./addDevServerEntrypoints')

const defaultOpts = {
    pageDir: 'src/pages', // page foler dir
    entry: '**/entry.js', // glob pattern
    template: 'index.html', // also support variables as [entryName].html / [entryName]/index.html
    output: '[entryName]/index.html', // or another name like [entryName].html
    minify: false,
    commonChunks: [], // common chunks besides each entry module
    debug: false,
    hot: false
}

function MultiPageWebpackPlugin(options) {
    this.options = Object.assign(defaultOpts, options)
    this._entries = null
}

/**
 * prepare entries
 * @return {Object}  entry map, eg: {a: './a.js', b: './b.js'}
 */
MultiPageWebpackPlugin.prototype.makeEntries = function(compiler) {
    const {context} = compiler.options
    const {pageDir, entry} = this.options
    const regName = entry.replace(/.*?(\w+)\.js/, '$1')
    const entryReg = new RegExp(`${regName}.js`)

    const entryPath = path.resolve(context, pageDir)
    const files = glob.sync(entry, {cwd: entryPath})

    if (files.length === 0) {
        throw new Error(`can not find any entry file with pattern ${entry} in ${entryPath}`)
    }

    return files.reduce((ret, item) => {
        const arrPath = item.split('/')
        let entryName = ''

        if (arrPath.length === 1) { // entry file without parent folder
            entryName = arrPath.split('.')[0]
        } else { // set parent folder name as entry name
            let entryFile = arrPath.pop()
            entryName = arrPath.pop()
        }

        ret[entryName] = path.resolve(entryPath, item)
        return ret
    }, {})
}

/**
 * make html-webpack-plugins from entry names
 * @return {Array}  HtmlWebpackPlugin list
 */
MultiPageWebpackPlugin.prototype.makeHtmlPlugins = function(entries, compiler) {
    const plugins = []
    const context = compiler.options.context

    entries.forEach(entryName => {
        const template = this.options.template.replace(/\[entryName\]/g, entryName)
        const chunks = [...this.options.commonChunks, entryName]
        const output = this.options.output

        const pluginOptions = {
            // filename: path.resolve(context, output.replace(/\[entryName\]/g, entryName)),
            filename: output.replace(/\[entryName\]/g, entryName),
            template,
            chunks,
            inject: 'body'
        }

        if (this.options.minify) {
            Object.assign(pluginOptions, {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: 'dependency'
            })
        }

        this.debug('------------ prepared plugin options --------------')
        this.debug(pluginOptions)

        plugins.push(new HtmlWebpackPlugin(pluginOptions))
    })

    return plugins
}

/**
 * main function
 */
MultiPageWebpackPlugin.prototype.apply = function(compiler) {
    // first prepare multiple entries
    compiler.plugin('environment', () => {
        let entry = compiler.options.entry
        let newEntries = []

        if (entry === MultiPageWebpackPlugin.ENTRY_NAME) {
            entry = newEntries = this.makeEntries(compiler)
        } else if (typeof entry === "string" || Array.isArray(entry)) {
            newEntries = this.makeEntries(compiler)
            entry = Object.assign({main: entry}, newEntries)
        } else if (typeof entry === 'object') {
            newEntries = this.makeEntries(compiler)
            entry = Object.assign(entry, newEntries)
        }

        compiler.options.entry = entry

        if (this.options.hot) {
            addDevServerEntrypoints(compiler.options)
        }

        this.debug('------------ prepared entries --------------')
        this.debug(entry)

        const newPlugins = this.makeHtmlPlugins(Object.keys(newEntries), compiler)
        compiler.options.plugins.push(...newPlugins)
        compiler.apply.apply(compiler, newPlugins);

        this._entries = entry
    })
}

MultiPageWebpackPlugin.prototype.debug = function(msg) {
    if (this.options.debug) {
        console.log(msg)
    }
}

MultiPageWebpackPlugin.ENTRY_NAME = '__MULTI_PAGE_WEBPACK_PLUGIN_ENTRY__'

module.exports = MultiPageWebpackPlugin
