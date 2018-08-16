requirejs(['data/elements'], function(elements) {
    Vue.component('param-select', {
        template: `
            <div
                class   ="param-select -sty"
                :class  ="[
                    type,
                    { empty : !value && value !== 0 }
                ]"
            >
                <!-- op -->
                <dropdown
                    v-if        ="type === 'op'"
                    v-model     ="value"
                    :options    ="params[1]"
                    :placeholder="placeholder"
                ></dropdown>

                <!-- str -->
                <input
                    v-if        ="type === 'str'"
                    type        ="text"
                    v-model     ="value"
                    :placeholder="placeholder"
                />

                <!-- num -->
                <input
                    v-if        ="type === 'num'"
                    type        ="number"
                    v-model     ="value"
                    :step       ="params[1] || 1"
                    :placeholder="placeholder"
                />

                <!-- hex / font -->
                <dropdown
                    v-if        ="type === 'hex' || type === 'font'"
                    v-model     ="value"
                    :options    ="list"
                    :placeholder="placeholder"
                ></dropdown>

                <!-- url -->
                <span v-if="type === 'url'">
                    url('<input
                        type    ="text"
                        v-model ="value"
                        :placeholder="placeholder"
                    />');
                </span>

                <!-- px -->
                <input
                    v-if            ="type === 'px'"
                    type            ="text"
                    v-model         ="tempValue"
                    :placeholder    ="placeholder"
                    @input          ="addUnit"
                    @keydown.up     ="editValue(1)"
                    @keydown.down   ="editValue(-1)"
                />

                <!-- sec -->
                <input
                    v-if        ="type === 'sec'"
                    v-model     ="tempValue"
                    type        ="number"
                    min         ="0"
                    :placeholder="placeholder"
                    @input      ="addUnit"
                />

                <!-- multi -->
                <div v-if="type === 'multi'" class="multi-container">
                    <div
                        v-for   ="(subtype, i) in params[1]"
                        :class  ="subtype"
                    >
                        <input
                            v-if            ="subtype === 'px'"
                            type            ="text"
                            v-model         ="multiTemp[i]"
                            :placeholder    ="placeholder"
                            @input          ="addUnit($event, i)"
                            @keydown.up     ="editValue(1, i)"
                            @keydown.down   ="editValue(-1, i)"
                        />
                        <dropdown
                            v-if        ="subtype === 'hex' || subtype === 'font'"
                            v-model     ="multiValue[i]"
                            :options    ="list"
                            :placeholder="placeholder"
                            @input      ="updateMulti"
                        ></dropdown>
                    </div>
                </div>
            </div>
        `,
        props: [
            'value',
            'params',
            'placeholder'
        ],
        data : function() {
            return {
                type : this.params[0],
                validateValue : '',
                list: [],
                tempValue : '',
                multiValue: this.params[1] ? this.params[1].map(p => '') : '',
                multiTemp: this.params[1] ? this.params[1].map(p => '') : ''
            }
        },
        created : function() {
            this.placeholder = this.placeholder || '';
            switch(this.type) {
                case 'px':
                    this.tempValue = this.value;
                    break;
                case 'hex':
                    this.list = elements.theme.color.map(c => '$' + c.ref);
                    break;
                case 'font':
                    this.list = elements.theme.typography.map(f => f.ref);
                    break;
                case 'multi':
                    if (this.value) {
                        this.multiTemp = this.value.split(' ');
                        this.multiValue = this.value.split(' ');
                    }
                    this.list = elements.theme.color.map(c => '$' + c.ref);
                    break;
            }
        },
        watch : {
            value : function(val) {
                if (typeof val !== 'undefined') {
                    this.$emit('input', this.value);
                }
            }
        },
        methods : {
            addUnit : function(e, i) {
                if (this.type === 'sec') {
                    this.value = this.tempValue + 's';
                } else if (i || i === 0) {
                    let val = this.validateUnit(this.multiTemp[i]);
                    this.multiTemp[i] = val.validated;
                    this.multiValue[i] = val.withUnit;
                } else {
                    let val = this.validateUnit(this.tempValue);
                    this.tempValue = val.validated;
                    this.value = val.withUnit;
                }
            },
            editValue : function(val, i) {
                if (i || i === 0) {
                    let num = this.multiTemp[i] && this.multiTemp[i].match(/^-?[0-9.]+/);
                    if (num) {
                        this.multiTemp[i] = this.multiTemp[i].replace(num[0], parseInt(num[0]) + val);
                    } else {
                        this.multiTemp[i] = val.toString();
                    }
                    this.addUnit(null, i);
                } else {
                    let num = this.tempValue.match(/^-?[0-9.]+/);
                    if (num) {
                        this.tempValue = this.tempValue.replace(num[0], parseInt(num[0]) + val);
                    } else {
                        this.tempValue = val.toString();
                    }
                    this.addUnit();
                }
            },
            updateMulti : function() {
                this.value = this.multiValue.filter(v => v).join(' ');
            },
            validateUnit : function(str) {
                let match = str.match(/^-?[0-9.]+(p|px|%|e|r|em|rem|pt|v|vw|vh)?$/),
                    num = str.match(/^-?[0-9.]+/);

                if (match) {
                    str = match[0];
                } else if (num) {
                    str = num[0];
                } else {
                    return {
                        validated : '',
                        withUnit  : ''
                    }
                }

                let unit = str.match(/(px|%|em|rem|pt|vw|vh)$/);
                return {
                    validated : str,
                    withUnit : num + (unit ? unit[0] : 'px')
                }
            }
        }
    })
});