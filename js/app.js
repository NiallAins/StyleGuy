requirejs([
	'data/elements',
	'data/properties',
	'lib/sass'
], function(
	elements, properties, Sass
) {
	Vue.component('v-style', {
		render: function (createElement) {
			return createElement('style', this.$slots.default)
		}
	});

	Sass.setWorkerUrl('./js/lib/sass.worker.js');

	//A11y keyboard interaction
	document.body.addEventListener('keyup', function(e) {
		if (event.keyCode === 13) {
			document.activeElement.click();
			this.setAttribute('keyboard-nav', 'true');
		}
	});
	document.body.addEventListener('keydown', function(e) {
		if (event.keyCode === 9) {
			this.setAttribute('keyboard-nav', 'true');
		}
	});
	document.body.addEventListener('click', function(e) {
		this.setAttribute('keyboard-nav', 'false');
	});

	let firstGroup = Object.keys(elements)[0],
	firstItem  = Object.keys(elements[firstGroup])[0];

	for(g in elements) {
		for (i in elements[g]) {
			elements[g][i].forEach(e => e.style = e.style || '');
		}
	}

	EventHub = new Vue();

	App = new Vue({
		el: '[app]',
		data: {
			loaded 		: false,
			cssmin 		: '',
			sassInject 	: '',
			tab 		: 'project',
			menuGroup 	: firstGroup,
			menuItem 	: firstItem,
			page 		: elements[firstGroup][firstItem],
			menu 		: elements,
			properties  : properties,
			sassCompile : new Sass(),
			
			projectTitle : '',
			themeColor	: '#5299E0',
			themeLogo	: '',
			themeColorPicker : false,
			themeEditor	: 'dark'
		},
		created : function() {
			this.generateCss();
		},
		mounted : function() {
			this.loaded = true;
		},
		methods : {
			generateCss : function(e, final) {
				this.sassInject = '';
				elements.theme.color.forEach(c => {
					this.sassInject += `$${c.ref}:var(--${c.ref});`;
				});
				elements.theme.typography.forEach(f => {
					if (f.props.some(p => (p || p === 0))) {				
						this.sassInject =
							`@mixin font-${f.selector.replace('.', '')} { ${
								Object.keys(properties.typography)
									.map((p, i) => p.replace(/[A-Z]/, '-$&').toLowerCase() + ' : ' + f.props[i])
									.filter((p, i) => (f.props[i] || f.props[i] === 0))
									.join(';')
							}; }`;
					}
				});

				let tempsass = '';
				for(let group in elements) {
					for (let item in elements[group]) {
						if (group === 'theme' && item === 'color') {
							tempsass += elements[group][item].reduce(
								(str, c) => str + `--${c.ref}:${c.hex};`,
								final ? ':root {' : '.-sty-preview {'
							) + '}';
						} else {
							tempsass += elements[group][item].reduce(
								(str, i) => {
									if (i.style) {
										str += (final ? '' : ' .-sty-preview ') +
											i.selector +
											'{' + i.style + '}';
									}
									return str;
								},
								''
							);
						}
					}
				}
				if (!final) {
					tempsass = tempsass.replace('-sty-preview body', '-sty-preview');
				}
				this.sassCompile.compile(
					this.sassInject + tempsass,
					styleObj => {
						if (styleObj.status === 0) {
							this.cssmin = styleObj.text;
							setTimeout(() => EventHub.$emit('css-updated'));
						}
					}
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
					selector	: elObj.selector,
					markup		: elObj.markup,
					justCreated : true
				};
				item.splice(index + 1, 0, newEl);
			},
			setThemeColor : function(colorObj) {
				if (colorObj) {
					let changeVar = (name, value) => document.body.style.setProperty('--c-' + name, value);
					let h = colorObj.h,
						s = colorObj.s,
						l = colorObj.l;

					changeVar('h', 				    h);
					changeVar('h-c',  (h + 180) % 360);
					changeVar('s', 	   	      s + '%');
					changeVar('l',  		  l + '%');
					changeVar('l-l', (l * 1.15) + '%');
					changeVar('l-l2', (l * 1.4) + '%');
					changeVar('l-d', (l * 0.85) + '%');
					changeVar('t', (l > 75 ? 'var(--c-text-dark)' : 'var(--c-text-light)'));

					this.themeColor = colorObj.hex;
				}
			},
			toggleEditorTheme : function() {
				this.themeEditor = (this.themeEditor === 'dark' ? 'light' : 'dark');
				[
					'bg-0', 'bg-1', 'bg-2', 
					'text',
					'hl-0','hl-1', 'hl-2', 'hl-3', 'hl-4', 'hl-5'
				].forEach(c => {
					document.body.style.setProperty(
						'--c-edit-' + c,
						'var(--c-' + this.themeEditor + '-' + c + ')'
					);
				});
			}
		}
	});

});