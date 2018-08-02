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
	
	new Vue({
		el: '[app]',
		data: {
			loaded 		: false,
			cssmin 		: '', 
			cssGlobal 	: '',
			sassInject 	: '',
			tab 		: 'edit',
			menuGroup 	: initGroup,
			menuItem 	: initItem,
			page 		: elements[initGroup][initItem],
			menu 		: elements,
			sassCompile : new Sass()
		},
		created : function() {
			this.setGlobalCss();
			this.generateCss();
		},
		mounted : function() {
			this.loaded = true;
		},
		methods : {
			setGlobalCss : function() {
				this.cssGlobal = '';
				this.sassInject = [];
				elements.theme.color.forEach(c => {
					this.cssGlobal  += `--${c.ref}:${c.hex};`;
					this.sassInject += `$${c.ref}:var(--${c.ref});`;
				});
			},
			generateCss : function() {
				this.cssmin = '';
				for(let group in elements) {
					for (let item in elements[group]) {
						if (group === 'theme' && item === 'color') {
							this.cssmin += elements[group][item].reduce(
								(str, c) => str + `--${c.ref}:${c.hex};`, 
								':root{'
							) + '}';
						} else {
							this.cssmin += elements[group][item].reduce(
								(str, i) => str + i.style || '',
								''
							);
						}
					}
				}
			},
			compileSass : function(item, index, scss) {
				this.sassCompile.compile(
					this.sassInject + scss,
					styleObj => item[index].style = styleObj.text
				); 
			},
			groupHasItems : function(group) {
				for(let item in group) {
					if (group[item].some(el => el.style || el.hex)) {
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