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
    {
      '@babel/helpers': true,
      process: true,
      debug: true,
      ms: true,
      globals: true,
      'source-map': true,
      buffer: true,
      'color-convert': true,
      chalk: true,
      '@babel/helper-module-imports': true,
      '@babel/helper-module-transforms': true,
      '@babel/helper-replace-supers': true,
      '@babel/helper-member-expression-to-functions': true,
      '@babel/helper-simple-access': true,
      'path-browserify': true,
      '@babel/core/lib/parser/util/missing-plugin-helper.js': true,
    },
    /^\@babel\/helper\-/,
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
  const code = content.replace(/\`([\w\W]+?)\`/gmi, (matched, innerCode) => {
    if (innerCode.indexOf('\n') > -1) {
      return '`\n' + innerCode.trim()
        .replace(/\n+/g, '\n')
        .replace(/ +/g, ' ')
        .replace(/\n /g, '\n')
        .replace(/\/\*.*?\*\//g, '')
        .replace(/\/\/.*?\n/g, '')
        .replace(/\n/g, '')
        + '\n`'
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
