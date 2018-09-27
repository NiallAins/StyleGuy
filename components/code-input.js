requirejs(['lib/highlight'], function(highlight) {
    Vue.component('code-input', {
        template: `
            <code
                class   ="code-input"
                :class  ="[
                    'type-' + type,
                    { 'has-wrapper' : wrapSelector }
                ]"
            >
                <p v-if="wrapSelector">
                    <em class="hljs-selector-tag">{{ wrapSelector }}</em>
                    <em class="hljs-selector-attr">{</em>
                </p>
                <textarea
                    ref         ="textarea"
                    v-if        ="!static"
                    v-model     ="value"
                    @input      ="updateMirror"
                    @select     ="updateMirror"
                    @mousedown  ="drag = true"
                    @mouseup    ="drag = false"
                    @mousemove  ="drag ? updateMirror() : ''"
                    @click      ="updateCaret"
                    @keyup      ="checkKey(true, $event.keyCode)"
                    @keydown    ="checkKey(false, $event.keyCode)"
                    @focus      ="
                        focused = true;
                        $emit('focus')
                    "
                    @blur       ="
                        focused = false;
                        $emit('blur')
                    "
                ></textarea>
                <div
                    class   ="selectionMirror"
                    v-html  ="selectionMirror"
                ></div>
                <div class="textMirror">
                    <div
                        ref     ="textMirror"
                        :class  ="(type === 'css' ? 'lang-scss' : 'lang-html')"
                    ></div>
                    <div
                        class   ="caret"
                        :class  ="{
                            focus : focused,
                            blink : caretBlink
                        }"
                        :style  ="{
                            left    : caretX + 'px',
                            top     : caretY + 'px'
                        }"
                    ></div>
                </div>
                <p v-if="wrapSelector">
                    <em class="hljs-selector-attr">}</em>
                </p>
            </code>
        `,
        props: [
            'value',
            'type',
            'wrapSelector',
            'static'
        ],
        data : function() {
            return {
                area        : null,
                caretX      : 0,
                caretY      : 0,
                focused     : false,
                caretBlink  : true,
                drag        : false,
                textarea    : null,
                textMirror  : null,
                selectionMirror : '',
                arrowKeyCheck   : 0,
                htmlStyles      : [
                    new RegExp(/(=|"|<|>|\/)/g),
                    new RegExp(/<\/?([^ \/>]+)/g),
                    new RegExp(/<[^>]+ ([a-z0-9_-]+)/g),
                    new RegExp(/"([^"]+)"/g)
                ]
            }
        },
        mounted : function() {
            this.textarea = this.$refs.textarea;
            this.textMirror = this.$refs.textMirror;
            this.updateMirror();
        },
        methods : {
            checkKey : function(up, key) {
                if (up && key === 186) {
                    //Semicolon
                    $emit('keyLineEnd');
                } else if (key >= 37 && key <= 40) {
                    //Arrow keys
                    if (up) {
                        clearInterval(this.arrowKeyCheck);
                        this.arrowKeyCheck = 0;
                        this.updateCaret();
                    } else if (!this.arrowKeyCheck) {
                        this.arrowKeyCheck = setInterval(() => this.updateCaret(0), 50);
                    }
                }
            },
            updateMirror : function() {
                this.textMirror.innerText = this.value;
                highlight.highlightBlock(this.textMirror);

                this.$emit('input', this.value);

                if (!this.static) {
                    this.updateCaret();
                }
            },
            updateCaret : function() {
                this.caretBlink = false;
                setTimeout(() => this.caretBlink = true, 2000);

                if (typeof this.value !== 'undefined') {
                    let prevText = this.value.substring(0, this.textarea.selectionStart);
                    let caretRow = prevText.match(/\n/g);
                    caretRow = caretRow ? caretRow.length : 0;
                    let caretCol = prevText.length - prevText.lastIndexOf('\n') - 1;
                    let charWidth  = 7.15,
                        lineHeight = 16;

                    this.caretX = caretCol * charWidth;
                    this.caretY = caretRow * lineHeight;

                    if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
                        this.selectionMirror =
                            ' '.repeat(this.textarea.selectionStart) +
                            '<span hljs-sel>' +
                            ' '.repeat(this.textarea.selectionEnd - this.textarea.selectionStart) +
                            '</span>';
                    } else {
                        this.selectionMirror = '';
                    }
                }
            }
        }
    });
});