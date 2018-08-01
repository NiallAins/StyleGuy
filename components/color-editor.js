Vue.component('color-editor', {
	props: [
		'editable',
		'value'
	],
	data : function() {
		return {
			pickerOpen : -1,
			pickerColor : '',
			editing : -1
		}
	},
	template: `
		<div class="color-editor row --sty">
			<table class="col-8 col-off-1">
				<tr v-for="(color, index) in value" v-bind:class="{ selected : editing === index }">
					<td class="c-name">
						<input type="text" v-model="color.name" v-bind:readonly="editing !== index" />
					</td>
					<td class="c-ref">
						--<input type="text" v-model="color.ref" v-bind:readonly="editing !== index" />
					</td>
					<td class="c-col" v-bind:class="{ pickerOpen : pickerOpen === index }">
						<div class="hex-text">
							{{ color.hex }}
						</div>
						<div class="sample" v-on:click="openPicker(index)">
							<div v-bind:style="{ backgroundColor: color.hex }"></div>
						</div>
					</td>
					<td class="c-btns" v-if="editable">
						<button class="edit sty-btn" v-on:click="editing = (editing < 0 ? index : -1)">
							<i class="edit"></i> Edit
						</button>
						<button class="add sty-btn">
							<i class="add"></i> Add Varient
						</button>
					</td>
				</tr>
				<color-picker
					v-bind:style="{ top: (pickerOpen * 80) + 11 }"
					v-if="pickerOpen > -1" v-model="pickerColor"
					v-on:close="closePicker"
				></color-picker>
			</table>
		</div>
	`,
	watch : {
		value : function(val) {
				this.$emit('input', this.value);
		}
	},
	methods : {
		openPicker : function(i) {
			if (this.editing === i) {
				if (this.pickerOpen === i) {
					this.pickerOpen = -1;
				} else {
					this.pickerColor = this.value[i].hex;
					this.pickerOpen = i;
				}
			}
		},
		closePicker : function(e) {
			if (e === 'select') {
				this.value[this.pickerOpen].hex = this.pickerColor;
			}
			this.pickerOpen = -1;
		}
	}
});