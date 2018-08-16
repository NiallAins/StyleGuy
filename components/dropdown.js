Vue.component('dropdown', {
    template: `
        <div
            ref     ="anchor"
            class   ="dropdown"
            :class  ="{ open : open || toggleAni }"
            :style  ="{ height: elheight }"
        >
            <input
                type    ="number"
                class   ="hidden"
                min     ="0"
                :max    ="length - 1"
                @click  ="toggle()"
                @input  ="selected = length - $event.target.value - 1"
            />
            <div
                class   ="scroll-container"
                :style  ="{
                    top     : containerY + 'px',
                    left    : containerX + 'px',
                    width   : containerW + 'px'
                }"
            >
                <div
                    class   ="dropdown-container"
                    :style  ="{
                        height : (open ? (length * elheight) + 2 : elheight - 3) + 'px',
                        top    : (open ? (selected * elheight * -1) - 2 : 0) + 'px'
                    }"
                >
                    <ul :style      ="{ top: open ? 0 : ((selected * elheight * -1) - 2) + 'px' }"
                        @mouseleave ="toggle('close')"
                        @click      ="toggle()"
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
                            {{ !open && placeholder ? placeholder : 'unset' }}
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
                </div>
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
            length : this.options.length + (this.forceselect ? 0 : 1),
            containerX : 0,
            containerY : 0,
            containerW : 0,
            toggleAni : false
        }
    },
    created : function() {
        if (this.value) {
            this.selected = this.options.indexOf(this.value) + (this.forceselect ? 0 : 1);
        }
        window.addEventListener('scroll', () => {
            if (this.open) {
                this.toggle('close');
            }
        });
    },
    watch : {
        value : function(val) {
            this.$emit('input', this.value);
        }
    },
    methods : {
        toggle : function(state) {
            if (this.toggleAni) {
                return;
            }
            if (state === 'close') {
                state = false;
            } else {
                state = !this.open;
            }

            if (state === true) {
                let rect = this.$refs.anchor.getBoundingClientRect();
                this.containerX = rect.left;
                this.containerY = Math.min(
                    window.innerHeight - (((this.selected - this.length - 1) * this.elheight) + 20),
                    Math.max(
                        (this.selected * this.elheight) + 20,
                        rect.top
                    )
                );
                this.containerW = rect.width;
                this.open = true;
                this.toggleAni = true;
                setTimeout(() => this.toggleAni = false, 200);
            } else if (state === false && this.open === true) {
                this.toggleAni = true;
                setTimeout(() => this.toggleAni = false, 200);
                this.open = false;
            } else {
                this.open = false;
            }
        }
    }
});