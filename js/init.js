requirejs.config({
  baseUrl: './js',
  paths: {
      lib  : './lib',
      data : '../data',
      comp : '../components'
  }
});

//Global Variables
let EventHub;

requirejs([
    'comp/dropdown',
    'comp/code-input',
    'comp/param-select',
    'comp/font-editor',
    'comp/font-page',
    'comp/color-picker',
    'comp/palette-picker',
    'comp/color-page',
    'comp/ui-editor',
    'comp/element-editor',
  'app'
]);