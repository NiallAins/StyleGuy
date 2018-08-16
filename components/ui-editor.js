requirejs(['data/properties'], function(properties) {
    Vue.component('ui-editor', {
        template: `
            <div class="ui-editor">
                <div
                    class   ="bg-mask"
                    @click  ="$emit('close')"
                ></div>
                <div class="container">
                    <span class="-sty close-btn">
                        <button @click  ="$emit('close')">
                            <i class="cancel"></i>
                        </button>
                    </span>
                    <div class="left-col props -sty">
                        <table
                            class   ="element-select"
                            :class  ="{ includeInput : isInput }"
                        >
                            <tr>
                                <th colspan="4">
                                    Current Selector
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    {{ value.selector }}
                                </td>
                                <td>
                                    <dropdown
                                        v-model     ="pseudo"
                                        placeholder ="Pseudo Element"
                                        :options    ="pseudos"
                                    ></dropdown>
                                </td>
                                <td>
                                    <dropdown
                                        v-model     ="state"
                                        placeholder ="UI State"
                                        :options    ="[
                                            ':hover',    
                                            ':focused',    
                                            ':visited',    
                                            ':active',
                                        ]"
                                    ></dropdown>
                                </td>
                                <td>
                                    <dropdown
                                        v-if        ="isInput"
                                        v-model     ="addState"
                                        placeholder ="Input State"
                                        :options    ="[
                                            ':checked',
                                            ':empty',
                                            ':invalid'
                                        ]"
                                    ></dropdown>
                                </td>
                            </tr>
                        </table>
                        <div
                            v-for   ="(section, label, i_sec) in properties"
                            class   ="expander"
                            :class  ="{ open : expanded === i_sec }"
                        >
                            <div
                                class   ="title"
                                @click  ="expanded = (expanded === i_sec ? -1 : i_sec)"
                            >
                                {{ label }}
                                <i  class   ="caret-d sm clear"
                                    :class  ="{ rotate : expanded === i_sec }"
                                ></i>
                            </div>
                            <div
                                class   ="prop"
                                v-for   ="(prop, label, i_prop) in section"
                                :class  ="{ open : subexpand[i_sec][i_prop] }"
                            >
                                <div 
                                    v-if="prop.length"
                                    class="prop-row"
                                >
                                    <div class="label">
                                        {{ label }}
                                    </div>
                                    <param-select
                                        placeholder ="unset"
                                        :params     ="prop"
                                        @input      ="propChange(label, $event)"
                                    ></param-select>
                                </div>
                                <div v-else>
                                    <div
                                        class="subprop prop-row"
                                        v-for="(subprop, sublabel, i_sub) in prop"
                                    >
                                        <i  v-if   ="i_sub === 0"
                                            class  ="elipsis sm clear"
                                            @click ="toggleSubprops(i_sec, i_prop)"
                                        ></i>
                                        <div class="sublabel">
                                            {{ sublabel }}
                                        </div>
                                        <param-select
                                            placeholder ="unset"
                                            :params     ="subprop"
                                            @input      ="propChange(sublabel, $event)"
                                        ></param-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class   ="expander-end"
                            @click  ="expanded = -1"
                        ></div>
                    </div>
                    <div class="top-row right-col preview">
                        <div
                            class   ="preview-centerer"
                            :style  ="{
                                transform: 'translate(-50%, -50%) scale(' + previewZoom + ', ' + previewZoom + ')'
                            }"
                        >
                            <div
                                ref     ="previewParent"
                                class   ="-sty-preview"
                                v-html  ="value.markup"
                            ></div>
                            <div
                                v-show  ="showOverlay"
                                class   ="preview-overlay"
                            >
                                <div v-for="(part, name) in overlay">
                                    <div
                                        class   ="part"
                                        :class  ="'overlay-' + name"
                                        :style  ="{
                                            width       : part.width + 'px',
                                            height      : part.height + 'px',
                                            marginTop   : part.margin[0] + 'px',
                                            marginLeft  : part.margin[1] + 'px',
                                            borderWidth : part.border.join(' ')
                                        }"
                                    ></div>
                                    <div
                                        class   ="desc"
                                        :style  ="{
                                            top             : -45 / previewZoom + 'px',
                                            paddingLeft     :  10 / previewZoom + 'px',
                                            paddingBottom   :  (20 / previewZoom) + part.margin[0] + 'px',
                                            borderLeftWidth :   2 / previewZoom + 'px',
                                            fontSize        :  12 / previewZoom + 'px',
                                            marginLeft      : part.margin[1] + 'px'
                                        }"
                                    >
                                        {{ name }}
                                        <br/>
                                        <span> {{ part.border.join(' ') }} </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="controls -sty">
                            <div class="zoom">
                                <i class="mag"></i>
                                <button
                                        v-for   ="z in [0.5, 1, 2, 4]"
                                        :class  ="{ active : previewZoom === z }"
                                        @click  ="previewZoom = z"
                                >
                                    {{ z.toString().replace('0', '') + 'x'}}
                                </button>
                            </div>
                            <button
                                class   ="showOverlay"
                                :class  ="{ active : showOverlay }"
                                @click  ="showOverlay = !showOverlay"
                            >
                                <i class="borders"></i>
                            </button>
                            <div
                                class       ="state"
                                :class      ="{
                                    open : selectStateOpen,
                                    selected : selectState && !selectStateOpen
                                }"
                                @click      ="selectStateOpen = !selectStateOpen"
                                @mouseleave ="selectStateOpen = false"
                            >
                                <button @click="selectStateOpen ? selectState = '' : ''">
                                    {{ selectStateOpen ? 'none' : selectState || ':' }}
                                </button>
                                <button @click="selectState = ':hover'">
                                    :hover
                                </button>
                                <button @click="selectState = ':focus'">
                                    :focus
                                </button>
                                <button @click="selectState = ':active'">
                                    :active
                                </button>
                                <button @click="selectState = ':vistied'">
                                    :visited
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="bottom-row right-col edit-html -sty">
                        <h2> Element HTML </h2>
                        <code>
                            <textarea
								spellcheck	="false"	
								v-model		="value.markup"
							></textarea>
                        </code>
                    </div>
                </div>
            </div>
        `,
        props: [
            'value'
        ],
        data : function() {
            return {
            properties: properties,
                pseudo : '',
                state : '',
                addState : '',
                expanded : -1,
                subexpand : Object.keys(properties).map(k => []),
                currentProps : {},
                isInput : this.value.selector.match(/input|select|textarea/),
                pseudos : [
                    '::after',
                    '::before',
                    '::first-letter',
                    '::first-line',
                    '::selection'
                ],
                overlay : {
                    content : {
                        width  : 0,
                        height : 0,
                        border : [0, 0, 0, 0],
                        margin : [0, 0]
                    },
                    padding  : {
                        width  : 0,
                        height : 0,
                        border : [0, 0, 0, 0],
                        margin : [0, 0]
                    },
                    border  : {
                        width  : 0,
                        height : 0,
                        border : [0, 0, 0, 0],
                        margin : [0, 0]
                    },
                    margin  : {
                        width  : 0,
                        height : 0,
                        border : [0, 0, 0, 0],
                        margin : [0, 0]
                    }
                },
                showOverlay : false,
                previewZoom : 1,
                selectState : '',
                selectStateOpen : false
            }
        },
        created : function() {
            if (this.isInput) {
                let extras = [];
                if (this.value.selector.match(/type="color"/)) {
                    extras = [
                        ['::color-swatch', ':-webkit-color-swatch'],
                        ['::color-swatch-wrapper', ':-webkit-color-swatch-wrapper'],
                    ];
                }
                if (this.value.selector.match(/type="date"/)) {
                    extras = [
                        ['::datetime-edit', ':-webkit-datetime-edit'],
                        ['::datetime-edit-fields-wrapper', ':-webkit-datetime-edit-fields-wrapper'],
                        ['::datetime-edit-text', ':-webkit-datetime-edit-text'],
                        ['::datetime-edit-month-field', ':-webkit-datetime-edit-month-field'],
                        ['::datetime-edit-day-field', ':-webkit-datetime-edit-day-field'],
                        ['::datetime-edit-year-field', ':-webkit-datetime-edit-year-field'],
                        ['::inner-spin-button', ':-webkit-inner-spin-button'],
                        ['::calendar-picker-indicator', ':-webkit-calendar-picker-indicator']
                    ];
                }
                if (this.value.selector.match(/type="number"/)) {
                    extras = [
                        ['::textfield-decoration-container', ':-webkit-textfield-decoration-container'],
                        ['::inner-spin-button', ':-webkit-inner-spin-button'],
                        ['::outer-spin-button', ':-webkit-outer-spin-button']
                    ];
                }
                if (this.value.selector.match(/type="range"/)) {
                    extras = [
                        ['::range-track', '::-moz-range-track, ::-ms-track, ::-webkit-slider-runnable-track'],
                        ['::range-thumb', '::-moz-range-thumb, ::-ms-thumb, ::-webkit-slider-thumb'],
                        ['::fill-lower', '::-ms-fill-lower'],
                        ['::fill-upper', '::-ms-fill-upper'],
                        ['::ticks-before', '::-ms-ticks-before'],
                        ['::ticks-after', '::-ms-ticks-after'],
                    ];
                }
                if (this.value.selector.match(/type="text"/)) {
                    extras = [['::clear-control', '::-ms-clear']];
                }
                if (this.value.selector.match(/type="select"/)) {
                    extras = [['::expand-arrow', '::-ms-expand']];
                }
                if (this.value.selector.match(/textarea/)) {
                    extras = [['::resizer', '::-webkit-resizer']];
                }
                if (this.value.selector.match(/type="select"/)) {
                    extras = extra.concat([
                        ['::placeholder', ':-moz-placeholder, :-ms-input-placeholder, ::-webkit-input-placeholder']
                    ]);
                }
                this.pseduos = this.pseduos.concat(extras);
            }

            EventHub.$on('css-updated', this.updateOverlay);
        },
        mounted : function() {
            this.updateOverlay();
        },
        watch : {
            value : function(val) {
                this.$emit('input', this.value);
            }
        },
        methods : {
            toggleSubprops : function(sec, prop) {
                let open = this.subexpand[sec][prop] ? false : true;
                this.$set(this.subexpand[sec], prop, open);
            },
            propChange : function(prop, value) {
                if (value === '') {
                    delete this.currentProps[prop];
                } else {
                    this.currentProps[prop] = value;
                }
                this.value.style =
                    Object
                        .keys(this.currentProps)
                        .map(k => k + ' : ' + this.currentProps[k] + ';')
                        .join('');
                    this.$emit('css-change');
            },
            updateOverlay : function() {
                let el = this.$refs.previewParent.firstChild,
                    rect = el.getBoundingClientRect(),
                    style = p => window.getComputedStyle(el, null).getPropertyValue(p);

                let w = Math.ceil(rect.width / this.previewZoom),
                    h = Math.ceil(rect.height / this.previewZoom),
                    p = [style('padding-top'),      style('padding-right'),         style('padding-bottom'),        style('padding-left')],
                    b = [style('border-top-width'), style('border-right-width'),    style('border-bottom-width'),   style('border-left-width')],
                    m = [style('margin-top'),       style('margin-right'),          style('margin-bottom'),         style('margin-left')];

                let pInt = p.map(i => parseInt(i)),
                    bInt = b.map(i => parseInt(i)),
                    mInt = m.map(i => parseInt(i));
                
                this.overlay.margin.width = w;
                this.overlay.margin.height = h;
                this.overlay.margin.border = m;

                this.overlay.border.width = w - bInt[1] - bInt[3];
                this.overlay.border.height = h - bInt[0] - bInt[2];
                this.overlay.border.border = b;
                this.overlay.border.margin = [mInt[0], mInt[3]];

                this.overlay.padding.width = w - bInt[1] - bInt[3] - pInt[1]- pInt[3];
                this.overlay.padding.height = h - bInt[0] - bInt[2] - pInt[0] - pInt[2];
                this.overlay.padding.border = p;
                this.overlay.padding.margin = [mInt[0] + bInt[0], mInt[3] + bInt[3]];

                this.overlay.content.width = 0;
                this.overlay.content.height = 0;
                this.overlay.content.border =  [
                    h - pInt[0] - pInt[2] - bInt[0] - bInt[2],
                    w - pInt[1] - pInt[3] - bInt[1] - bInt[3],
                    0, 0
                ].map(b => b + 'px');
                this.overlay.content.margin = [mInt[0] + bInt[0] + pInt[0], mInt[3] + bInt[3] + pInt[3]];
            }
        }
    })
});