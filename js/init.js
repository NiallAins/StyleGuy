requirejs.config({
  baseUrl: './js',
  paths: {
      lib  : './lib',
      data : '../data',
      comp : '../components'
  }
});

requirejs(['app']);