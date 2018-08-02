requirejs([
    'data/elements',
    'lib/sass',
    'comp/color-editor',
    'comp/color-picker',
    'comp/element-editor'
  ], function(
    elements, Sass
  ) {
    Vue.component('v-style', {
        render: function (createElement) {
            return createElement('style', this.$slots.default)
        }
    });

    Sass.setWorkerUrl('./js/lib/sass.worker.js');
  
    let initGroup = Object.keys(elements)[0],
    initItem  = Object.keys(elements[initGroup])[0];

    for(g in elements) {
      for (i in elements[g]) {
        elements[g][i].forEach(e => e.style = e.style || '');
      }
    }
  
    let app = new Vue({
        el: '[app]',
        data: {
            cssmin : '', 
            cssGlobal : '',
            sassInject : [],
            tab : 'edit',
            menuGroup : initGroup,
            menuItem :  initItem,
            page : elements[initGroup][initItem],
            menu : elements,
            sass : new Sass()
        },
        created : function() {
            this.generateCss();
        },
        methods : {
          generateCss : function() {
            this.cssmin = '';
            for(let group in elements) {
              for (let item in elements[group]) {
                elements[group][item].forEach(i => {
                  if (i.style) {
                    this.cssmin += i.style;
                  }
                });
              }
            }
          },
          compileSass : function(item, index, scss) {
            this.sass.compile(
                this.sassInject.join(' ') + ' ' + scss,
                styleObj => item[index].style = styleObj.text
            ); 
          },
          groupHasItems : function(group) {
            for(let item in group) {
              if (group[item].style) {
                return true;
              }
            }
            return false;
          },
          addElement : function(item, index, elObj) {
            let newEl = {
              selector: elObj.selector,
              markup: elObj.markup,
              justCreate : true
            };
            item.splice(index + 1, 0, newEl);
          }
        }
    });
  
});