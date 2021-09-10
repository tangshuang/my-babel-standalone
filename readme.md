# tiny-babel-standalone

> Fork: this project is fork from my-babel-standalone, and want to build a tiny babel-standalone to be used in browser. It exports UMD, you can use modular import or use directly in browser. It did not contain plugins and presets, if you want to include @babel/preset-env or any other plugins, you should clone this project and invoke `registerPlugins` and `registerPresets` to add them.

This standalone build uses [@babel/preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env), [@babel/polyfill](https://github.com/babel/babel/tree/master/packages/babel-polyfill), and [whatwg-fetch](https://github.com/github/fetch) to create an experience that mirrors modern browsers. It does not include presets for flow, react, and typescript.

* [@babel/standalone](https://github.com/babel/babel/tree/master/packages/babel-standalone) = 5-6 mb minified
* [my-babel-standalone](https://github.com/joncasey/my-babel-standalone) = 1.5 mb minified
* [tiny-babel-standalone](https://github.com/tangshuang/my-babel-standalone) = 1mb without plugins and presets, parser+generate 610kb

Currently, it's being used in the latest builds of [modern-hta](https://github.com/joncasey/modern-hta).

## Usage

```html
<script src="https://unpkg.com/tiny-babel-standalone"></script>
<script>
  const {
    version,
    parse,
    traverse,
    types,
    generate,
    availablePlugins,
    availablePresets,
    buildExternalHelpers,
    registerPlugin,
    registerPlugins,
    registerPreset,
    registerPresets,
    transform,
    transformFromAst,
  } = Babel

  const ast = parse(code, {
    tokens: true,
    sourceType: 'unambiguous',
  })

  traverse(ast, {
    ...
  })

  const newCode = generate(ast, {
    ...
  })
</script>
```

```html
<script src="https://unpkg.com/tiny-babel-standalone/dist/parser.min.js"></script>
<script>
  const {
    version,
    parse,
    types,
    generate,
  } = Babel

  const ast = parse(code, {
    tokens: true,
    sourceType: 'unambiguous',
  })

  const newCode = generate(ast, {
    ...
  })
</script>
```
