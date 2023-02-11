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

it('Should do nothing', () => run(expect, 'a { font-size: 1em }', 'a { font-size: 1em }'));

it('Should be text-align: right', () => run(expect, 'a { text-align: left }', 'a { text-align: right }'));

it('Should correctly process values containing !important', () => run(expect, '.test { margin-left: 0 !important; padding-left: 0 !important }', '.test { margin-right: 0 !important; padding-right: 0 !important }'));

it('Should ignore declarations prefixed with /* rtl:ignore */', () => run(
  expect,
  '/* rtl:ignore */ .test { margin-left:0; padding-left:0 }',
  '.test { margin-left:0; padding-left:0 }',
));

it('/* rtl:ignore */: Should leave other selectors alone', () => run(
  expect,
  '/* rtl:ignore */ .test { margin-left:0 } '
        + '.rtled { margin-left:0; padding-left:0 }',

  '.test { margin-left:0 } '
        + '.rtled { margin-right:0; padding-right:0 }',
));

it('/* rtl:ignore */: should understand overrides', () => run(
  expect,
  '.x { left: 0 } /* rtl:ignore */.x { direction: ltr }',

  '.x { right: 0 } .x { direction: ltr }',
));

it('/* rtl:begin:ignore */ starts ignore mode', () => run(
  expect,
  '/* rtl:begin:ignore */'
        + '.foo { padding-left: 0 }'
        + '.bar { direction: ltr }',

  '.foo { padding-left: 0 }.bar { direction: ltr }',
));

it('/* rtl:end:ignore */ stops ignore mode', () => run(
  expect,
  '/* rtl:begin:ignore */'
        + '.foo { padding-left: 0 }'
        + '/* rtl:end:ignore */'
        + '.bar { direction: ltr }',

  '.foo { padding-left: 0 }'
        + '.bar { direction: rtl }',
));

it('/* rtl:ignore */ can be used inside /* rtl:begin:ignore */ and /* rtl:end:ignore */', () => run(
  expect,
  '/* rtl:begin:ignore */'
        + '.foo { padding-left: 0 }'
        + '/* rtl:ignore */'
        + '.bar { direction: ltr }'
        + '.baz { left: 0 }'
        + '/* rtl:end:ignore */',

  '.foo { padding-left: 0 }.bar { direction: ltr }.baz { left: 0 }',
));

it('that it ignores normal comments ', () => run(
  expect,
  '/* some comment */ .foo { padding-left: 0 }',
  '/* some comment */ .foo { padding-right: 0 }',
));

it('/*! rtl:begin:ignore */ and /*! rtl:end:ignore */ should consider as a valid directive', () => run(
  expect,
  '/*rtl:begin:ignore*/.foo { padding-left: 0 }'
        + '/*rtl:end:ignore*/'
        + '.bar { direction: ltr }',

  '.foo { padding-left: 0 }'
        + '.bar { direction: rtl }',
));

it('Value based ignore important comments are honored', () => run(
  expect,
  '.foo { margin-left: 12px; padding-left: 12px/* rtl:ignore */; }',
  '.foo { margin-right: 12px; padding-left: 12px; }',
));

it('Value use /*rtl:{name}:{value}*/ or nameless /*rtl:{value}*/.', () => run(
  expect,
  '.foo { font-family:"Droid Sans", Tahoma/*rtl:prepend:"Droid Arabic Kufi",*/; font-size:14px/*rtl:16px*/; }',
  '.foo { font-family:"Droid Arabic Kufi","Droid Sans", Tahoma; font-size:16px; }',
));

it('Value use /*rtl:{name}:{value}*/ or nameless /*rtl:{value}*/.', () => run(
  expect,
  'div {/*rtl:begin:ignore*/left:10px;/*rtl:end:ignore*/ text-align:left;}',
  'div {left:10px; text-align:right;}',
));
