# PostCSS-DIMA-RTL

PostCSS-dima-rtl is a [PostCSS] RTL Plugin use [RTLCSS].

It verifies if the name of your CSS/PCSS file includes the suffix '-rtl', and if so, it applies [RTLCSS] to the RTL file exclusively.

[PostCSS]: https://github.com/postcss/postcss
[RTLCSS]: https://github.com/MohammadYounes/rtlcss
## **Examples**

**LTR input:**
```css
.code {
  direction:ltr;
  text-align:left;
}
```
**RTL output:**
```css
.code {
  direction:rtl;
  text-align:right;
}
```

## **Value Directives**

**LTR input:**
```css
body { 
    font-family:"Droid Sans", Tahoma/*rtl:prepend:"Droid Arabic Kufi",*/; 
    font-size:14px/*rtl:16px*/; 
}
```

**RTL output:**
```css
body {  
  font-family:"Droid Arabic Kufi","Droid Sans", 
  Tahoma; font-size:16px; 
}
```

## Ignoring specific declarations
To skip flipping specific declarations use some of supported directives:

| Syntax | Description |
| ------ | ----------- |
| `/*rtl:ignore*/` | Ignores processing of the following node or nodes within scope. |

Ignore one rule:
```css
  /*rtl:ignore*/
.code {
  direction:ltr;
  text-align:left;
}
```

Value-syntax to ignore a single CSS declaration::
```css
.code {
  direction:ltr;
  text-align:left /* rtl:ignore */;
}
```

Self-closing:
```css
.code {
  /*rtl:ignore*/
  direction:ltr;
  /*rtl:ignore*/
  text-align:left;
}
```

Block-syntax:
```css
.code {
  /*rtl:begin:ignore*/
  direction:ltr;
  text-align:left;
  /*rtl:end:ignore*/
}

```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-dima-rtl
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-dima-rtl'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
