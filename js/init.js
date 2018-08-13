requirejs.config({
  baseUrl: './js',
  paths: {
      lib  : './lib',
      data : '../data',
      comp : '../components'
  }
});

requirejs([
    'comp/dropdown',
    'comp/param-select',
    'comp/font-editor',
    'comp/font-page',
    'comp/color-picker',
    'comp/color-page',
    'comp/ui-editor',
    'comp/element-editor',
  'app'
]);