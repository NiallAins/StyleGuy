export default {
	props: [
			'editable',
			'value'
	],
	data : function() {
		return {
				editMode: 'css',
				activeAdd: false,
				addClass: '',
				addSelector: ''
		}
	},
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
											<li role="tab"
													tabIndex="0"
													v-bind:class="{ selected : editMode === 'css' }"
													v-on:click="editMode = 'css'"
											>
													css <span>/ scss</span>
											</li>
											<li role="tab"
													tabIndex="0"
													v-bind:class="{ selected : editMode === 'html' }"
													v-on:click="editMode = 'html'"
											>
													html
											</li>
									</ul>
									<code v-show="editMode === 'css'">
											<p>{{ value.selector }} {</p>
											<textarea spellcheck="false" v-on:blur="compileSass($event.target.value)"></textarea>
											<p>}</p>
									</code>
									<code v-show="editMode === 'html'">
											<textarea v-model="value.markup" spellcheck="false"></textarea>
									</code>
							</div>

							<code v-if="!editable">
									{{ value.markup }}
							</code>
					</div>
				</div>
				<div class="row" v-if="editable">
					<div class="col-8 col-off-4 no-pad-t --sty">
						<div class="add-varient" v-bind:class="{ active : activeAdd }">
							<button v-on:click="activeAdd = !activeAdd" class="add-element">
								<i class="add"></i> Add varient
							</button>
							<div v-show="activeAdd" class="row no-pad-v">
								<div class="col-5">
									<label for="newClass"> Class name </label>
									<input
										type="text"
										v-model="addClass"
										v-on:
										placeholder="ex. secondary"
									/>
								</div>
								<div class="col-1">
									<span> or </span>
								</div>
								<div class="col-6">
									<label for="newClass"> Css selector </label>
									<input
										type="text"
										v-model="addSelector"
										v-bind:placeholder="'ex. nav > ' + value.selector + '.menu-item'"
									/> 
								</div>
							</div>
							<div class="row no-pad-v">
								<div class="col-12 content-right">
									<button class="create-element" v-on:click="addElement()"> Create </button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`,
	watch : {
		value : function(val) {
				this.$emit('input', this.value);
		}
	},
	methods : {
		addElement : function() {
			this.activeAdd = false;

			if (this.addClass) {
				this.$emit('add-element', value.selector + (this.addClass[0] !== '.' ? '.' : '') + this.addClass);
			} else if (this.addSelector) {
				this.$emit('add-element', this.addSelector);          
			} else {
				this.activeAdd = true;
			}
		},
		compileSass : function(inputCode) {
			let scss = app.$data.sassInject.join(' ') + ' ' + this.value.selector + ' {' + inputCode + '}';
			let comp = this;
			app.$data.sass.compile(scss, styleObj => this.value.style = styleObj.text);
		}
	}
};