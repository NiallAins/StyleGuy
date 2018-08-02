Vue.component('element-editor', {
	template: `
		<div class="element-editor">
			<div class="row fill-height vert-center">
				<div class="col-4 center-preview">
					<v-style>
						{{ '.preview ' + value.style }}
					</v-style>
					<div class="preview" v-html="value.markup"></div>
				</div>

				<div class="col-8 no-pad-b --sty">
					<div class="css-edit" v-if="editable">
						<ul role="tablist">
							<li role		="tab"
								tabIndex	="0"
								v-bind:class="{ selected : editMode === 'css' }"
								v-on:click	="editMode = 'css'"
							>
								css <span>/ scss</span>
							</li>
							<li role		="tab"
								tabIndex	="0"
								v-bind:class="{ selected : editMode === 'html' }"
								v-on:click	="editMode = 'html'"
							>
								html
							</li>
						</ul>
						<code v-show="editMode === 'css'">
							<p>{{ value.selector }} {</p>
								<textarea
									spellcheck="false"
									v-on:blur="compileSass($event.target.value)"
								></textarea>
							<p>}</p>
						</code>
						<code v-show="editMode === 'html'">
							<textarea
								spellcheck="false"
								v-model="value.markup"
							></textarea>
						</code>
					</div>

					<code v-if="!editable">
						{{ value.markup }}
					</code>
				</div>
			</div>
			<div class="row" v-if="editable">
				<div class="col-8 col-off-4 no-pad-t --sty">
					<div
						class="add-varient"
						v-bind:class="{ active : activeAdd }"
					>
						<button
							class="add-element"
							v-on:click="activeAdd = !activeAdd"
						>
							<i class="add"></i> Add varient
						</button>
						<div 
							v-show="activeAdd"
							class="row no-pad-v"
						>
							<div class="col-5">
								<label for="newClass"> Class name </label>
								<input
									type		="text"
									v-model		="addClass"
									placeholder	="ex. secondary"
								/>
							</div>
							<div class="col-1">
								<span> or </span>
							</div>
							<div class="col-6">
								<label for="newClass"> Css selector </label>
								<input
									type	="text"
									v-model	="addSelector"
									v-bind:placeholder="'ex. nav > ' + value.selector + '.menu-item'"
								/> 
							</div>
						</div>
						<div class="row no-pad-v">
							<div class="col-12 content-right">
								<button
									class="create-element"
									v-on:click="addElement()"
								>
									Create
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	props: [
		'editable',
		'value'
	],
	data : function() {
		return {
			editMode	: 'css',
			activeAdd	: false,
			addClass	: '',
			addSelector	: ''
		}
	},
	watch : {
		value : function(val) {
			this.$emit('input', this.value);
		}
	},
	methods : {
		compileSass : function(inputCode) {
			this.$emit('compile-sass', this.value.selector + ' {' + inputCode + '}');
		},
		addElement : function() {
			this.activeAdd = false;

			if (this.addClass) {
				let newSelector = this.value.selector + (this.addClass[0] !== '.' ? '.' : '') + this.addClass;
				this.$emit('add-element', {
					selector: newSelector,
					markup: this.selectorToMarkup(newSelector, this.value.markup)
				});
			} else if (this.addSelector) {
				this.$emit('add-element', { 
					selector: this.addSelector,
					newMarkup: this.selectorToMarkup(this.addSelector, this.value.markup)
				});          
			} else {
				this.activeAdd = true;
			}
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
	}
});