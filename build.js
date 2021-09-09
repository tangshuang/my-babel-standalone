const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')

const webpackConfig = {
  mode: 'production',
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       babelrc: false,
      //       presets: [
      //         '@babel/preset-env'
      //       ]
      //     }
      //   }
      // }
    ]
  },
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            ascii_only: true
          }
        }
      })
    ],
    concatenateModules: true,
    usedExports: true,
    sideEffects: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'Babel',
    libraryTarget: 'commonjs2',
    pathinfo: true,
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /^\.{2}\/package\.json/,
      `${__dirname}/package.json`
    )
  ],
  externals: [
    // {
    //   '@babel/helpers': 'var __BABEL_HELPERS__',
    //   process: 'var __BABEL_PROCESS__',
    //   debug: 'var __BABEL_DEBUG__',
    //   ms: 'var __BABEL_MS__',
    //   globals: 'var __BABEL_GLOBALS__',
    //   'source-map': 'var __BABEL_SOURCE_MAP__',
    //   buffer: 'var __BABEL_BUFFER__',
    //   'color-convert': 'var __BABEL_COLOR_CONVERT__',
    //   chalk: 'var __BABEL_CHALK__',
    //   '@babel/helper-module-imports': 'var __BABEL_HELPERS__',
    //   '@babel/helper-module-transforms': 'var __BABEL_HELPERS__',
    //   '@babel/helper-replace-supers': 'var __BABEL_HELPERS__',
    //   '@babel/helper-member-expression-to-functions': 'var __BABEL_HELPERS__',
    //   '@babel/helper-simple-access': 'var __BABEL_HELPERS__',
    //   'path-browserify': 'var __BABEL_PATH_BROWSERIFY__',
    //   '@babel/core/lib/parser/util/missing-plugin-helper.js': 'var __BABEL_HELPERS__',
    // },
    // function(ctx, request, callback) {
    //   if (/^\@babel\/helper\-/.test(request)) {
    //     return callback(null, 'var __BABEL_HELPERS__')
    //   }
    //   callback()
    // },
  ],
}

const pack = (config = webpackConfig) => new Promise((resolve, reject) => {
  webpack(config, (err, stats) => err ? reject(err) : resolve(stats))
})

const build = async (src, dst) => {
  const config = { ...webpackConfig, entry: `./src/${src}` }
  config.output.filename = dst
  if (dst.indexOf('.min.') === -1) {
    config.mode = 'none'
    delete config.optimization
  }
  try {
    console.log(`pack( ${src}, ${dst} )`)
    const stats = await pack(config)
    console.log(stats.toJson('minimal'))
    console.log('build success')
  }
  catch (e) {
    console.error(e)
  }
}

const cleanTaggedTemplateExpression = (file) => {
  const filePath = path.resolve(__dirname, 'dist', file)
  const content = fs.readFileSync(filePath).toString()
  const code = content
    .replace(/\)\`([\w\W]+?)\`,/gmi, (matched, innerCode) => {
      if (innerCode.indexOf('\n') > -1) {
        return ')`\n' + innerCode.trim()
          .replace(/\n+/g, '\n')
          .replace(/ +/g, ' ')
          .replace(/\n /g, '\n')
          .replace(/\/\*.*?\*\//g, '')
          .replace(/\/\/.*?\n/g, '')
          .replace(/\n/g, '')
          + '\n`,'
      }
      return matched
    })
  fs.writeFileSync(filePath, code)
}

;(async () => {
  await build('index.js', 'babel.js')
  await build('index.js', 'babel.min.js')
  cleanTaggedTemplateExpression('babel.min.js')
})()
