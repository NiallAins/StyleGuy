Vue.component('dropdown', {
    template: `
        <div
            class   ="dropdown"
            :style  ="{ height: elheight }"
        >
            <input
                type    ="number"
                class   ="hidden"
                min     ="0"
                :max    ="length - 1"
                @click  ="open = !open"
                @input  ="selected = length - $event.target.value - 1"
            />
            <div
                class   ="dropdown-container"
                :class  ="{ open : open }"
                :style  ="{
                    height : (open ? (length * elheight) + 2 : elheight) + 'px',
                    top    : (open ? selected * elheight * -1 : 0) + 'px'
                }"
            >
            <ul :style      ="{ top: (open ? 0 : selected * elheight * -1) + 'px' }"    
                @mouseleave ="open = false"
                @click      ="open = !open"
            >
                    <li v-if    ="!forceselect"
                        class   ="unset"
                        :class  ="{ selected : selected === 0 }"
                        :style  ="{
                            height      : elheight + 'px',
                            lineHeight  : elheight + 'px'
                        }"
                        @click  ="
                            value = '';
                            selected = 0;
                        "
                    >
                        {{ placeholder || '' }}
                    </li>
                    <li
                        v-for       ="(op, i) in options"
                        :class      ="{ selected : selected === (forceselect ? i : i + 1) }"
                        :style      ="{
                            height      : elheight + 'px',
                            lineHeight  : elheight + 'px'
                        }"
                        @click      ="
                            value = op;
                            selected = forceselect ? i : i + 1
                        "
                    >
                        {{ op }}
                    </li>
                </ul>
                {{ selected }}
            </div>
        </div>
    `,
    props: [
        'value',
        'options',
        'placeholder',
        'forceselect'
    ],
    data : function() {
        return {
            elheight : 22,
            open : false,
            selected : 0,
            length : this.options.length + (this.forceselect ? 0 : 1)
        }
    },
    created : function() {
        if (this.value) {
            this.selected = this.options.indexOf(this.value) + (this.forceselect ? 0 : 1);
        }
    },
    watch : {
        value : function(val) {
            this.$emit('input', this.value);
        }
    }
});