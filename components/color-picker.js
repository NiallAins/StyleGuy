export default {
	props: [
		'value'
	],
	data : function() {
		return {
			h : 0,
			s : 0,
			l : 0,
			r : 0,
			g : 0,
			b : 0,
			a : 1,
			x : 0,
			y : 0,
			hex : '',
			editMode: 2,
			dragging : false
		}
	},
	template: `
		<div class="color-picker">
			<div class="sample-contain">
				<div class="sample" v-bind:style="{ backgroundColor : value, color : l / a > 50  ? 'black' : 'white' }" v-bind:editmode="editMode">
					<div class="hsl">
						hsl{{ a < 1 ? 'a' : '' }}(
							<input type="text" v-model="h" v-on:input="syncFrom('hsl')" />,
							<input type="text" v-model="s" v-on:input="syncFrom('hsl')" />,
							<input type="text" v-model="l" v-on:input="syncFrom('hsl')" />{{ a < 1 ? ',' : '' }}
							<input type="text" v-model="a" v-if="a < 1" class="alpha" />                                          
						)
					</div>
					<div class="rgb">
						rgb{{ a < 1 ? 'a' : '' }}(
							<input type="text" v-model="r" v-on:input="syncFrom('rgb')" />,
							<input type="text" v-model="g" v-on:input="syncFrom('rgb')" />,
							<input type="text" v-model="b" v-on:input="syncFrom('rgb')" />{{ a < 1 ? ',' : '' }}
							<input type="text" v-model="a" v-if="a < 1" class="alpha" />                                          
						)
					</div>
					<div class="hex">
						# <input type="text" v-model="hex" v-on:input="syncFrom('hex')"  />
					</div>
					<i
						class="caret-v sm"
						v-bind:class="{ dark : l / a >= 50 }"
						v-on:click="editMode++; editMode %= 3;"
					></i>
				</div>
			</div>
			<div
				class="palette"
				v-on:click     ="setXY($event); syncFrom('hsl');"
				v-on:mousedown ="dragging = true"
				v-on:mouseup   ="dragging = false"
				v-on:mouseleave="dragging = false"
				v-on:mousemove ="dragging ? setXY($event) : ''; dragging ? syncFrom('hsl') : ''"
				v-bind:style="{ backgroundColor : 'hsl(' + h +', 100%, 50%)' }"
			>
				<div class="cursor" v-bind:style="{top: y + '%', left: x + '%'}"></div>
			</div>
			<input
				class="hue-slider"
				type="range"
				v-model="h"
				min="0"
				max="360"
				v-on:input="syncFrom('hsl')" 
			/>
			<div class="alpha-contain">
				<input
					class="alpha-slider"
					type="range"
					v-model="a"
					min="0"
					max="1"
					step="0.02"
					v-bind:style="{
						background  : 'linear-gradient(to right, transparent, ' + this.value.substr(0, 7) + ')',
						borderColor : this.value.substr(0, 7)
					}"
				/>
			</div>
			<div class="footer">
				<button class="sty-btn sm" v-on:click="close(true)">
						<i class="accept"></i> Select
				</button>
				<button class="sty-btn sm" v-on:click="close(false)">
						<i class="cancel"></i> Cancel
				</button>
			</div>
		</div>
	`,
	created : function() {
		if (this.value) {
			this.hex = this.value[0] === '#' ? this.value.substr(1) : this.value;
		} else {
			this.hex = '2a7e7e';
		}
		this.syncFrom('hex');
	},
	watch : {
		a : function() { this.setHex(); this.setValue(); }
	},
	methods : {
		close : function(select) {
			this.$emit('close', select ? 'select' : 'cancel');
		},
		setXY : function(e) {
			if (e) {
				this.x = (e.offsetX / 255) * 100;
				this.y = (e.offsetY / 255) * 100;
				this.s = Math.round(this.x);
				this.l = Math.round((100 - this.y) / (1 + (this.x / 100)));
			} else {
				this.x = this.s;
				this.y = 100 - (this.l * (1 + (this.x / 100)));
			}
		},
		setValue : function(e) {
			this.value = '#' + this.hex;
			this.$emit('input', this.value);

			this.$emit('colorObj', {
				h : this.h,
				s : this.s,
				l : this.l,
				r : this.r,
				g : this.g,
				b : this.b,
				a : this.a,
				hsla : `hsla(${this.h}, ${this.s}%, ${this.l}%${this.a < 1 ? ' ,' + this.a : ''})`,
				rgba : `rgba(${this.r}, ${this.g}%, ${this.b}%${this.a < 1 ? ' ,' + this.a : ''})`,
				hex  : this.value
			});
		},
		syncFrom : function(form) {
			if (form === 'hsl') {
				this.setFromHSL();
			} else if (form === 'rgb') {
				this.HSLFromRGB();
				this.setHex();
				this.setXY();
			} else if (form === 'hex') {
				this.RGBFromHex();
				this.HSLFromRGB();
				this.setXY();
			}

			this.setValue();
		},
		setFromHSL : function() {
				this.h = Math.round(this.h);
				this.s = Math.round(this.s);
				this.l = Math.round(this.l);

				let rh = this.h / 360,
						rs = this.s / 100,
						rl = this.l / 100;

				if (this.s === 0){
					this.r = this.g = this.b = rl;
				} else {
					let q = rl < 0.5 ? rl * (1 + rs) : rl + rs - rl * rs;
					let p = 2 * rl - q;
					this.r = this.hueToRGB(p, q, rh + 1/3);
					this.g = this.hueToRGB(p, q, rh);
					this.b = this.hueToRGB(p, q, rh - 1/3);
				}

				this.r = Math.round(this.r * 255);
				this.g = Math.round(this.g * 255);
				this.b = Math.round(this.b * 255);

				this.setHex();
		},
		HSLFromRGB : function() {
			let r1 = this.r / 255,
					g1 = this.g / 255,
					b1 = this.b / 255;
			
			let maxColor = Math.max(r1, g1, b1),
					minColor = Math.min(r1, g1, b1);

			this.l = (maxColor + minColor) / 2,
			this.s = 0,
			this.h = 0;

			if (maxColor !== minColor){
					if (this.l < 0.5) {
							this.s = (maxColor - minColor) / (maxColor + minColor);
					} else {
							this.s = (maxColor - minColor) / (2.0 - maxColor - minColor);
					}

					if (r1 === maxColor) {
							this.h = (g1 - b1) / (maxColor - minColor);
					} else if (g1 === maxColor) {
							this.h = 2.0 + (b1 - r1) / (maxColor - minColor);
					} else {
							this.h = 4.0 + (r1 - g1) / (maxColor - minColor);
					}
			}
		
			this.l *= 100;
			this.s *= 100;
			this.h *= 60;
			if (this.h < 0) {
					this.h += 360;
			}
		},
		setHex : function() {
			this.hex = [this.r, this.g, this.b].map(c => {
				c = c.toString(16);
				return c.length < 2 ? '0' + c : c;
			}).join('');

			if (this.a < 1) {
				let hexA = Math.round(this.a * 255).toString(16);
				this.hex += hexA.length < 2 ? '0' + hexA : hexA;
			}
		},
		RGBFromHex : function() {
			this.r = parseInt(this.hex.substr(0, 2), 16);
			this.g = parseInt(this.hex.substr(2, 2), 16);
			this.b = parseInt(this.hex.substr(4, 2), 16);

			if (this.hex.length > 6) {
				this.a = parseInt(this.hex.substr(6, 2), 16);
			}
		},
		hueToRGB : function hue2rgb(p, q, t){
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1/6) return p + (q - p) * 6 * t;
			if (t < 1/2) return q;
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
	}
};