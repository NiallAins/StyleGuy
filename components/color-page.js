Vue.component('color-page', {
	template: `
		<div class="color-page -sty">
			<p>
				Colors can be referenced elsewhere in the style guide using their sass variable name.
				<br/>
				Colors can be referenced in external stylesheets using their css variable name.
			</p>
			<div
				class="row"
				v-for="(color, index) in value"
			>
				<div
					class	="col-10 editable no-pad-v"
					:class	="{ selected : editing === index }"
				>
					<div class="col-3 c-ref">
						--<input
							type		="text" 
							placeholder	="color name"
							v-model		="color.ref"
							:readonly	="editing !== index"
						/>
					</div>
					<div
						class	="col-3 c-col"
					>
						<div class="hex-text">
							{{ color.hex }}
						</div>
						<div class="sample">
							<div :style="{ backgroundColor: color.hex }"></div>
						</div>
					</div>
					<div
						class	="col-4 c-btns"
						v-if	="editable"
					>
						<button
							class	="edit sty-btn"
							@click	="editing === index ? callUndo() : setUndo(index)"
						>
							<span v-show="editing !== index">
								<i class="edit"></i> Edit
							</span>
							<span v-show="editing === index">
								<i class="cancel"></i> Cancel
							</span>
						</button>
						<button
							class	="add sty-btn"
							@click	="
								editing < 0 ? copyColor(index) : '';
								editing === index ? saveColor() : '';
							"
						>
							<span v-show="editing !== index">
								<i class="add"></i> Add Copy
							</span>
							<span v-show="editing === index">
								<i class="accept"></i> Save
							</span>
						</button>
					</div>
					<div class="col-2">
						<button
							class	="sty-btn delete"
							@click	="deleteColor(index)"
						>
							<span v-show="editing === index">
								<i class="delete"></i> Delete
							</span>
						</button>
					</div>
				</div>
			</div>
			<div
				class	="row"
				v-if	="editable"
			>
				<div class="col-11">
					<button 
						class	="sty-btn"
						@click	="addColor"
					>
						<i class="add"></i> Add color
					</button>
				</div>
			</div>
			<color-picker
				v-if			="editing > -1"
				v-model			="value[editing].hex"
				:style			="{ top: (editing * 80) + 100 + 'px' }"
				:hideControls	="true"
				:disableBackdrop="true"
			></color-picker>
		</div>
	`,
	props: [
		'editable',
		'value'
	],
	data : function() {
		return {
			editing 	: -1,
			pickerColor : '',
			undoRef 	: '',
			undoHex 	: '',
			newCol 		: false
		}
	},
	watch : {
		value : function(val) {
			this.$emit('input', this.value);
		}
	},
	methods : {
		colorChange : function(e) {
			this.$emit('color-change');
		},
		setUndo : function(i) {
			this.undoRef = this.value[i].ref;
			this.undoHex = this.value[i].hex;
			this.editing = i;
		},
		callUndo : function() {
			if (this.newCol) {
				this.deleteColor(this.editing);
			} else {
				this.value[this.editing].ref = this.undoRef;
				this.value[this.editing].hex = this.undoHex;
			}
			this.editing = -1;
		},
		saveColor : function() {
			this.newCol = false;
			this.$emit('color-change');
			this.editing = -1;
		},
		copyColor : function(i) {
			let newRef = this.value[i].ref,
				num = newRef.match(/[0-9]+$/);
			this.addColor(
				null,
				num ? newRef.replace(num[0], parseInt(num[0]) + 1) : newRef + '-2',
				this.value[i].hex
			);
		},
		addColor : function(e, ref, hex) {
			let i = this.value.push({
				"ref" : ref || '',
				"hex" : hex || ''
			});
			this.newCol = true;
			this.editing = i - 1;
		},
		deleteColor : function(i) {
			this.editing = -1;
			this.value.splice(i, 1);
		}
	}
});