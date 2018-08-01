requirejs.config({
  baseUrl: './',
  paths: {
      data: './data',
      comp: './components'
  }
});

requirejs([
  'data/elements',
  'comp/color-editor',
  'comp/color-picker',
  'comp/element-editor'
], function(
  elements
) {

  let initGroup = Object.keys(elements)[0],
  initItem  = Object.keys(elements[initGroup])[0];

  for(g in elements) {
    for (i in elements[g]) {
      elements[g][i].forEach(e => e.style = e.style || '');
    }
  }

  Vue.component('v-style', {
      render: function (createElement) {
          return createElement('style', this.$slots.default)
      }
  });

  let app = new Vue({
      el: '[app]',
      data: {
          cssmin : '', 
          cssGlobal : '--test: blue',
          sassInject : ['$test: blue;'],
          tab : 'edit',
          menuGroup : initGroup,
          menuItem :  initItem,
          page : elements[initGroup][initItem],
          menu : elements,
          sass : new Sass()
      },
      methods : {
        generateCss : function() {
          this.cssmin = '';
          for(let group in elements) {
            //this.cssmin += '\/*$i' + group + '*\/';
            for (let item in elements[group]) { 
              //this.cssmin += '\/*$i' + item + '*\/';
              elements[group][item].forEach(i => {
                //this.cssmin += '\/*$e' + i.markup + '*\/';
                if (i.style) {
                  this.cssmin += i.style;
                }
              });
            }
          }
        },
        groupHasItems : function(group) {
          for(let item in group) {
            if (group[item].style) {
              return true;
            }
          }
          return false;
        },
        addElement : function(item, index, newSelector) {
          let newEl = {
            selector: newSelector,
            markup: this.selectorToMarkup(newSelector, item[index].markup),
            justCreate : true
          };
          item.splice(index + 1, 0, newEl);
        },
        selectorToMarkup: function(sel, markup) {
          let els   = [],
              close = [];

          while (sel.length > 0) {
              let el = sel.match(/(^|[ >~+])[^ >~+]+$/);
              if (el === null) {
                  let junk = sel.match(/[ >~+]+$/);
                  sel = sel.substring(0, junk.index);
                  continue;
              }
              sel = sel.substring(0, el.index);

              let rel;
              if (sel.length > 0) {
                  rel = el[0][0];
                  el = el[0].substring(1);
              } else {
                  el = el[0];
              }

              let closeTag = false
              if (els.length === 0 || els[els.length - 1].indexOf('Direct Sibling') > -1) {
                  closeTag = true;
              } else {
                  close.push('</' + el.match(/^[a-z0-9-]+/)[0] + '>');
              }

              let content = els.length === 0 ? markup.match(/>(.*)</)[1] : false;
              els.push(this.selectorToTag(el, rel, closeTag, content));
          }
          
          els = els.reverse();
          let tabs = 0;
          els.forEach((e, i)=> {
              els[i] = '  '.repeat(tabs) + e;
              close[close.length - (tabs + 1)] = '  '.repeat(tabs) + close[close.length - (tabs + 1)];
              if (e.indexOf('></') === -1) {
                  tabs++;
              }
          });
          return els.join('\n') + '\n' + close.join('\n');
        },
        selectorToTag: function(sel, rel, closeTag, content) {
            let tag   = sel.match(/^[a-z0-9-]+/i),
                cl    = sel.match(/\.[a-z0-9-]+/ig),
                id    = sel.match(/#[a-z0-9-]+/i),
                attr  = sel.match(/\[[a-z0-9-]+[~\^\$\|\*]?(="[a-z0-9-\(\)]*")?\]/ig),
                state = sel.match(/:(disabled|read-only)/i),
                child = sel.match(/:(last-child|first-child|nth-child\([0-9]+\))/i);

            tag = tag ? tag[0] : 'div';
            
            return '<' +
                tag +
                (id ? ` id="${id[0].replace('#', '')}"` : '') +
                (cl ? ` class="${cl.join(' ').replace(/\./g, '')}"` : '') +
                (attr ? ' ' + attr.join(' ').replace(/\[|\]/g, '') : '') +
                (state ? ' ' + state[1] : '') +
                '>' +
                (content || '') +
                (closeTag ? `</${tag}>` : '') +
                (child ? ' <!-- ' + child[1] + ' -->' : '') +
                (rel === '>' ? ' <!-- Direct Child -->' : '') +
                (rel === '+' ? ' <!-- Direct Sibling -->' : '');
        }
      },
      created : function() {
        this.generateCss();
      }
  });

});