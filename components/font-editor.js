requirejs(['data/properties'], function(properties) {
    Vue.component('font-editor', {
        template: `
            <div
                class   ="font-editor element-editor"
                :class  ="{ editable : editable }"
            >
                <div class="row fill-height vert-center">
                    <div class="col-4 center-preview">
                        <div
                            class="-sty-preview"
                            v-html="value.markup"
                        ></div>
                    </div>

                    <div class="col-8 no-pad-v -sty">
                        <div class="css-edit" v-if="editable">
                            <ul role="tablist">
                                <li role    ="tab"
                                    tabindex="0"
                                    :class  ="{ selected : editMode === 'css' }"
                                    @click	="editMode = 'css'"
                                >
                                    css
                                </li>
                                <li role	="tab"
                                    tabIndex="0"
                                    :class  ="{ selected : editMode === 'html' }"
                                    @click	="editMode = 'html'"
                                >
                                    html
                                </li>
                            </ul>
                            <code v-show="editMode === 'css'">
                                <p>{{ value.selector }} {</p>
                                    <div
                                        class="row no-pad-v"
                                        v-for="(v, k, i) in fontProps"
                                    >
                                        <div class="param-name">
                                            {{ k }} :
                                        </div>
                                        <div class="param-value">
                                            <param-select
                                                :params     ="v"
                                                placeholder ="unset"
                                                v-model     ="value.props[i]"
                                                @input      ="compileCss"
                                            ></param-select>
                                        </div>
                                    </div>
                                <p>}</p>
                            </code>
                            <code v-show="editMode === 'html'">
                                <textarea
                                    spellcheck  ="false"
                                    v-model     ="value.markup"
                                ></textarea>
                            </code>
                        </div>

                        <code v-if="!editable">
                            {{ value.markup }}
                        </code>
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
                editMode : 'css',
                fontProps : properties.typography
            }
        },
        watch : {
            value : function(val) {
                this.$emit('input', this.value);
            }
        },
        created : function() {
            if (this.value.props.length === 0) {
                Object.keys(properties.typography)
                    .forEach(k => this.value.props.push(''));
            }
        },
        methods : {
            compileCss : function() {
                this.value.style =
                    Object.keys(this.fontProps)
                            .map((p, i) => this.value.props[i] ? p + ' : ' + this.value.props[i] : '')
                            .filter((p, i) => this.value.props[i] !== '')
                            .join(';') +
                    ';'
                this.value.style = this.value.style.replace(/\$([a-z0-9-]+)/i, 'var(--$1)');
                this.$emit('css-change');
            }
        }
    })
});