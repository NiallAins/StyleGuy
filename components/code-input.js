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
                <em hl-1>{{ wrapSelector }}</em>
                <em hl-0>{</em>
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
                @keyup.37   ="updateCaret"
                @keyup.38   ="updateCaret"
                @keyup.39   ="updateCaret"
                @keyup.40   ="updateCaret"
                @keyup.186  ="$emit('keyLineEnd')"
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
                <div v-html="styledText"></div>
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
                <em hl-0>}</em>
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
            styledText  : '',
            caretX      : 0,
            caretY      : 0,
            focused     : false,
            caretBlink  : true,
            drag        : false,
            selectionMirror : '',
            htmlStyles : [
                new RegExp(/(=|"|<|>|\/)/g),
                new RegExp(/<\/?([^ \/>]+)/g),
                new RegExp(/<[^>]+ ([a-z0-9_-]+)/g),
                new RegExp(/"([^"]+)"/g)
            ]
        }
    },
    mounted : function() {
        this.textarea = this.$refs.textarea;
        this.updateMirror();
    },
    methods : {
        updateMirror : function() {
            if (!this.static) {
                let pos = 0;
                this.value = this.value
                    .replace(
                        /({|;)\n([^ }])/g,
                        (m, p1, p2) => {
                            pos += 2;
                            return p1 + '\n  ' + p2;
                        }
                    );
                setTimeout(() => {
                    this.textarea.selectionStart += pos;
                    this.textarea.selectionEnd += pos;
                });
            }

            if (this.type === 'css') {
                this.styledText = this.value
                    .replace(
                        /(\.[^{,]+)({|,)/g,
                        '<em hl-2>$1</em>$2'
                    )
                    .replace(
                        /(^|})([^{]+){/g,
                        '$1<em hl-1>$2</em>{'
                    )
                    .replace(
                        /(^|{|;)([^:]+):/g,
                        '$1<em hl-3>$2</em>:'
                    )
                    .replace(
                        /:([^;]+);/g,
                        ':<em hl-4>$1</em>;'
                    )
                    .replace(
                        /(:|\{|\}|,|;)/g,
                        '<em hl-0>$1</em>'
                    );
            } else if (this.type === 'html') {
                let styleInserts = [],
                    result;
                this.htmlStyles.forEach((r, i) => {
                    while((result = r.exec(this.value)) !== null) {
                        let index = result.index + result[0].indexOf(result[1]);
                        styleInserts.push([i, index, index + result[1].length]);
                    }
                });
                this.styledText = this.value;
                styleInserts.sort((a, b) => b[1] - a[1]).forEach(r => {
                    this.styledText =
                        this.styledText.slice(0, r[1]) +
                        '<em hl-' + r[0] + '>' +
                        this.styledText.slice(r[1], r[2])
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/\//g, '&sol;') +
                        '</em>' +
                        this.styledText.slice(r[2]);
                });
            }
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
                        this.value.slice(0, this.textarea.selectionStart)
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/\//g, '&sol;') +
                        '<em hl-sel>' +
                        this.value.slice(this.textarea.selectionStart, this.textarea.selectionEnd)
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/\//g, '&sol;') +
                        '</em>';
                } else {
                    this.selectionMirror = '';
                }
            }
        }
    }           
});

{/* <em hl-sel>ra<</em>
<em hl-sel>ra<</em<em hl-0>&gt;</em>
<em hl-sel>ra<</em<em hl-0>&gt;</em>
<em hl-sel>ra<em hl-0>&lt;</em></em> */}