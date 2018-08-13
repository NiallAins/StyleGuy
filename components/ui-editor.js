requirejs(['data/properties'], function(properties) {
    Vue.component('ui-editor', {
        template: `
            <div class="ui-editor">
                <div class="bg-mask"></div>
                <div class="container">
                    <div class="top-row left-col props -sty">
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
                                <i  class   ="caret-d clear"
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
                                        :params     ="prop"
                                        placeholder ="unset"
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
                                            :params     ="subprop"
                                            placeholder ="unset"
                                        ></param-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="top-row right-col preview">
                    </div>
                    <div class="bottom-row left-col edit-css -sty">
                    </div>
                    <div class="bottom-row right-col edit-html -sty">
                    </div>
                </div>
            </div>
        `,
        props: [
        ],
        data : function() {
            return {
                properties: properties,
                expanded : -1,
                subexpand : Object.keys(properties).map(k => [])
            }
        },
        created : function() {
        },
        watch : {
        },
        methods : {
            toggleSubprops : function(sec, prop) {
                let open = this.subexpand[sec][prop] ? false : true;
                this.$set(this.subexpand[sec], prop, open);
            }
        }
    })
});