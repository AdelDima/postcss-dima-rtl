import postcss from 'postcss';
import postcssImport from 'postcss-import';
import plugin from '../index';

const normalize = (cssString) => cssString.replace(/} /g, '}'); /* fix extra space added by `postcss-import` */

const run = (expect, input, output, opts) => postcss([postcssImport, plugin(opts)])
  .process(input, {from: undefined})
  .then((result) => {
    expect(normalize(result.css)).toEqual(normalize(output));
    expect(result.warnings().length).toEqual(0);
  });

// it("Should do nothing", () =>
//   run(expect, "a { font-size: 1em }", "a { font-size: 1em }"));

// it('Should be text-align: right', () =>
//   run(expect, 'a { text-align: left }', 'a { text-align: right }'));

// it("Should correctly process values containing !important", () =>
//   run( expect,".test { margin-left: 0 !important; padding-left: 0 !important }",".test { margin-right: 0 !important; padding-right: 0 !important }"));

it('Should ignore declarations prefixed with /* rtl:ignore */', () => run(
expect,
'/* rtl:ignore */ .test { margin-left:0; padding-left:0 }',
'.test { margin-left:0; padding-left:0 }',
));
