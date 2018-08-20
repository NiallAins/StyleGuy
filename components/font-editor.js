requirejs(['data/properties'], function(properties) {
    Vue.component('font-editor', {
        template: `
            <div
                class   ="font-editor element-editor"
                :class  ="{ editable : editable }"
            >
                <div class="row">
                    <div class="col-4">
                        <div class="col-12 -sty desc">
                            {{ desc }}
                        </div>
                        <div class="col-12 center-preview">
                            <div
                                class="-sty-preview"
                                v-html="value.markup"
                            ></div>
                        </div>
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
                                <li></li>
                            </ul>
                            <code v-show="editMode === 'css'" class="code-input">
                                <p hl-1>
                                    {{ value.selector }}
                                    <em hl-0>{</em>
                                </p>
                                <div
                                    class="row no-pad-v"
                                    v-for="(v, k, i) in fontProps"
                                >
                                    <div hl-3 class="param-name">
                                        {{ k }}<em hl-0>:</em>
                                    </div>
                                    <div hl-4 class="param-value">
                                        <param-select
                                            :params     ="v"
                                            placeholder ="unset"
                                            v-model     ="value.props[i]"
                                            @input      ="compileCss"
                                        ></param-select>
                                    </div>
                                </div>
                                <p hl-0>}</p>
                            </code>
                            <code-input
                                v-show		="editMode === 'html'"
                                v-model		="value.markup"
                                type 		="html"
                            ></code-input>
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
                fontProps : properties.typography,
                desc : ''
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
            this.compileDesc();
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

                this.compileDesc();
            },
            compileDesc : function() {
                let pr = this.value.props,
                    d = [],
                    name = pr[0].match(/^(.*)[,$]/);

                d.push(
                    name ? name[0] : '',
                    pr[1].length === 3 ? 'weight ' + pr[1] : '',
                    pr[1].length > 3 ? pr[1] : '',
                    pr[2],
                    pr[3],
                    pr[4],
                    pr[5],
                    pr[6],
                    (pr[7] || pr[8]) ? (pr[7] || 'auto') + '-' + (pr[8] || 'auto') + ' spaced' : '',
                    pr[9] ? 'with shadow' : ''
                );

                this.desc = d.filter(p => p).join(' | ');
                
            }
        }
    })
});