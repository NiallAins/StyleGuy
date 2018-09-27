Vue.component('palette-picker', {
	template: `
		<div class="palette-picker">
			<div class="bg-mask"></div>
			<div class="modal">
				<div class="row">
					<div class="col spread-desc">
						<input
							class	="spread-slider"
							type	="range"
							v-model	="spread"
							min		="0"
							max		="180"
							@input  ="setPoints(null)"
						/>
						<ul>
							<li :class="{active: spread == 0}"					>Monochromatic</li>
							<li :class="{active: spread > 0 && spread <= 115}"	>Analogous</li>
							<li :class="{active: spread > 115 && spread < 125}"	>Triadic</li>
							<li :class="{active: spread >= 125 && spread < 180}">Split-Complimentary</li>
							<li :class="{active: spread == 180}"				>Complementary</li>
						</ul>
					</div>
					<div
						class		="col hue-container"
						@mouseup	="dragging = false"
						@mouseleave	="dragging = false"
						@mousemove	="dragging ? setPoints($event) : ''"
					>
						<div
							class		="hue-picker"
							@click		="setPoints"
							@mousedown	="dragging = true"
							:style		="{ background: genColorWheel() }"
						>
							<div class="cursor prim" :style="{left: pts[0].x - 4 + 'px', top: pts[0].y - 3 + 'px'}"></div>
							<div class="cursor" 	 :style="{left: pts[1].x + 'px', top: pts[1].y + 'px'}" v-show="spread !== 0"></div>
							<div class="cursor"		 :style="{left: pts[2].x + 'px', top: pts[2].y + 'px'}" v-show="spread !== 0"></div>
						</div>
						<input
							class	="l-slider"
							:style	="{ background: 'linear-gradient(to right, black, hsl(' + h + ', 100%, ' + l + '%), white)' }"
							type	="range"
							v-model	="l"
							min		="0"
							max		="100"
							@input  ="genPalette"
						/>
					</div>
					<table class="col colors">
						<tr v-for="type in types">
							<td
								v-for	="varient in varients"
								:style	="{ backgroundColor: palette[type + (varient ? '-' + varient : '')] }"
								:class	="{ inactive : inactive.indexOf(type + (varient ? '-' + varient : '')) > -1}"
							>
								<i
									class="add clear"
									@click="activeToggle(type + (varient ? '-' + varient : ''))"
								></i>
								<span>{{ fullType[type] }} {{ varient }}</span>
							</td>
						</tr>
					</table>
				</div>
				<div class="row">
					<div class="col-12 content-right no-pad">
						<button
							class	="sty-btn"
							@click	="close(true)"
						>
							<i class="accept"></i> Save
						</button>
						<button
							class	="sty-btn"
							@click	="close(false)"
						>
							<i class="cancel"></i> Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`,
	props: [
		'value',
	],
	data : function() {
		return {
			h: 0,
			s: 80,
			l: 50,
			spread: 120,
			palette: {
				'prim': 		'#f00',
				'prim-light': 	'#f66',
				'prim-lighter': '#fcc',
				'prim-dark': 	'#c00',
				'prim-darker': 	'#600',
				'sec': 			'#0f0',
				'sec-light': 	'#6f6',
				'sec-lighter': 	'#cfc',
				'sec-dark': 	'#0c0',
				'sec-darker': 	'#060',
				'tert': 		'#00f',
				'tert-light': 	'#66f',
				'tert-lighter': '#ccf',
				'tert-dark': 	'#00c',
				'tert-darker': 	'#006'
			},
			inactive: [],
			types: [
				'prim',
				'sec',
				'tert'
			],
			fullType : {
				'prim' : 'Primary',
				'sec'  : 'Secondary',
				'tert' : 'Tertiary'
			},
			varients: [
				'lighter',
				'light',
				'',
				'dark',
				'darker'
			],
			dragging: false,
			pts: [
				{ x: 0, y: 0 },
				{ x: 0, y: 0 },
				{ x: 0, y: 0 }
			]
		}
	},
	created : function() {
		this.setPoints();
	},
	methods : {
		setPoints: function(e) {
			const radius = 128;
			let rad,
				ang,
				spread_rad = this.spread / 180 * Math.PI;
			if (e) {
				let xp  = e.offsetX - radius,
					yp  = e.offsetY - radius;
				rad = Math.min(radius, Math.sqrt((xp * xp) + (yp * yp)));
				ang = Math.atan2(yp, xp);

				this.s = Math.round((rad / radius) * 100);
				this.h = Math.round(ang / Math.PI * 180);
			} else {
				rad = this.s / 100 * 128;
				ang = this.h / 180 * Math.PI;
			}

			this.pts = [
				{ x: rad * Math.cos(ang), y: rad * Math.sin(ang) },
				{ x: rad * Math.cos(ang - spread_rad), y: rad * Math.sin(ang - spread_rad) },
				{ x: rad * Math.cos(ang + spread_rad), y: rad * Math.sin(ang + spread_rad) }
			].map(p => {
				return {
					x: p.x += radius,
					y: p.y += radius
				}
			});

			this.genPalette();
		},
		genColorWheel: function() {
			return `conic-gradient(from 90deg, ${
				[0, 60, 120, 180, 240, 300, 0]
					.map(h => `hsl(${h}, 100%, ${this.l}%)`)
					.join()
			})`;
		},
		genPalette: function() {
			this.types = ['prim'];
			this.spread = parseInt(this.spread);
			if (this.spread !== 0) {
				this.types.push('sec');
				if (this.spread !== 180) {
					this.types.push('tert');
				}
			}

			this.types.forEach(type => {
				let h = this.h;
				if (type === 'sec') {
					h -= this.spread;
				} else if (type === 'tert') {
					h += this.spread;
				}

				let light = Math.floor((100 - this.l) / 3);
				let dark = Math.ceil(this.l / 3);
				this.$set(this.palette, type, 				`hsl(${h}, ${this.s}%, ${this.l}%)`);
				this.$set(this.palette, type + '-light',  	`hsl(${h}, ${this.s}%, ${this.l - -light}%)`);
				this.$set(this.palette, type + '-lighter',	`hsl(${h}, ${this.s}%, ${this.l - (light * -2)}%)`);
				this.$set(this.palette, type + '-dark',  	`hsl(${h}, ${this.s}%, ${this.l - dark}%)`);
				this.$set(this.palette, type + '-darker',	`hsl(${h}, ${this.s}%, ${this.l - (dark * 2)}%)`);
			});

		},
		activeToggle: function(col) {
			let pos = this.inactive.indexOf(col);
			if (pos === -1) {
				this.inactive.push(col);
			} else {
				this.inactive.splice(pos, 1);
			}
		},
		close : function(save) {
			if (save) {
				let palHex = {};

				for(let c in this.palette) {
					let hueToRGB = (p, q, t) => {
						if (t < 0) t += 1;
						if (t > 1) t -= 1;
						if (t < 1/6) return p + (q - p) * 6 * t;
						if (t < 1/2) return q;
						if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
						return p;
					}

					let ch = parseInt(this.palette[c].match(/\(([0-9-]*),/)[1]),
						cs = parseInt(this.palette[c].match(/, ([0-9-]*)%,/)[1]),
						cl = parseInt(this.palette[c].match(/, ([0-9-]*)%\)/)[1]);

					let r, g, b,
						rh = ch / 360,
						rs = cs / 100,
						rl = cl / 100;

					if (cs === 0){
						r = g = b = rl;
					} else {
						let q = rl < 0.5 ? rl * (1 + rs) : rl + rs - rl * rs;
						let p = 2 * rl - q;
						r = hueToRGB(p, q, rh + 1/3);
						g = hueToRGB(p, q, rh);
						b = hueToRGB(p, q, rh - 1/3);
					}

					palHex['c-' + c] = '#' + (
						[
							Math.round(r * 255),
							Math.round(g * 255),
							Math.round(b * 255)
						].map(c => {
							c = c.toString(16);
							return c.length < 2 ? '0' + c : c;
						}).join('')
					);
				}
				this.$emit('close', palHex);
			} else {
				this.$emit('close', null);
			}
		}
	}
});