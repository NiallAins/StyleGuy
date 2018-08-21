Vue.component('color-picker', {
	template: `
		<div class="color-picker">
			<div
				v-if	="!disableBackdrop"
				class	="bg-mask"
				@click	="close(false)"
			></div>
			<div class="modal">
				<div class="sample-contain">
					<div
						class			="sample"
						:editmode	="editMode"
						:style	="{
							backgroundColor : value,
							color : l / a > 75  ? 'black' : 'white' 
						}"
					>
						<div class="hsl">
							hsl{{ a < 1 ? 'a' : '' }}(<input
								type			="number"
								v-model			="h"
								@input		="syncFrom('hsl')"
								min				="0"
								max 			="360"
							/>,
							<input
								type			="number"
								v-model			="s"
								@input		="syncFrom('hsl')"
								min				="0"
								max 			="100"
							/>%,
							<input
								type			="number"
								v-model			="l"
								@input		="syncFrom('hsl')" 
								min				="0"
								max 			="100"
							/>%{{ a < 1 ? ',' : '' }}
							<input
								v-if	="a < 1"
								type	="number"
								class	="alpha"
								v-model	="a"
								min		="0"
								max 	="1"
								step	="0.05"
							 />)
						</div>
						<div class="rgb">
							rgb{{ a < 1 ? 'a' : ''}}(<input
								type			="number"
								v-model			="r"
								@input		="syncFrom('rgb')"
								min				="0"
								max 			="255"
							/>,
							<input
								type			="number"
								v-model			="g"
								@input		="syncFrom('rgb')"
								min				="0"
								max 			="255"
							/>,
							<input
								type			="number"
								v-model			="b"
								@input		="syncFrom('rgb')"
								min				="0"
								max 			="255"
							/>{{ a < 1 ? ',' : '' }}
							<input
								v-if	="a < 1"
								type	="number"
								class	="alpha"
								v-model	="a"
								min		="0"
								max 	="1"
								step	="0.05"
							/>)
						</div>
						<div class="hex">
							#<input
								type		="text"
								v-model		="hex"
								@input	="syncFrom('hex')"
							/>
						</div>
						<i	class		="caret-v clear sm"
							:class="{ dark : l / a >= 50 }"
							@click	="editMode++; editMode %= 3;"
						></i>
					</div>
				</div>
				<div
					class			="palette"
					@click		="setXY($event); syncFrom('hsl');"
					@mousedown	="dragging = true"
					@mouseup	="dragging = false"
					@mouseleave	="dragging = false"
					@mousemove	="dragging ? setXY($event) : ''; dragging ? syncFrom('hsl') : ''"
					:style	="{ backgroundColor : 'hsl(' + h +', 100%, 50%)' }"
				>
					<div class="cursor" :style="{top: y + '%', left: x + '%'}"></div>
				</div>
				<input
					class		="hue-slider"
					type		="range"
					v-model		="h"
					min			="0"
					max			="360"
					@input	="syncFrom('hsl')" 
				/>
				<div class="alpha-contain">
					<input
						class		="alpha-slider"
						type		="range"
						v-model		="a"
						min			="0"
						max			="1"
						step		="0.02"
						:style="{
							background  : 'linear-gradient(to right, transparent, ' + this.value.substr(0, 7) + ')',
							borderColor : this.value.substr(0, 7)
						}"
					/>
				</div>
				<div
					class="footer"
					v-if="!hideControls"
				>
					<button class="sty-btn sm" @click="close(true)">
						<i class="accept"></i> Select
					</button>
					<button class="sty-btn sm" @click="close(false)">
						<i class="cancel"></i> Cancel
					</button>
				</div>
			</div>
		</div>
	`,
	props: [
		'value',
		'hideControls',
		'disableBackdrop'
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
			editMode : 2,
			dragging : false,
			defaultHex : '2a7e7e'
		}
	},
	created : function() {
		if (this.value) {
			this.hex = this.value[0] === '#' ? this.value.substr(1) : this.value;
		} else {
			this.hex = this.defaultHex;
		}
		this.syncFrom('hex');
	},
	watch : {
		a : function() {
			this.setHex();
			this.setValue();
		}
	},
	methods : {
		close : function(select) {
			if (select) {
				this.$emit(
					'close',
					{
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
					}
				);
			} else {
				this.$emit('close', null);
			}
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
});