Vue.component('font-page', {
	template: `
        <div class="font-page">
            <p class="--sty">
                Fonts can be referenced elsewhere in the styleguide with a sass mixin:
                <br/>
                @include font-[font name]
            </p>
            <font-editor
                v-for       ="font in value"
                v-model     ="font"
                :editable   ="editable"
                @css-change ="$emit('css-change')"
            ></font-editor>
            <div
                v-if    ="editable"
                class   ="row --sty"
            >
                <div class="col-12">
                    <button
                        class   ="sty-btn"
                        :click  ="addFont"
                    >
                        <i class="add"></i> Add font class
                    </button>
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
            
		}
	},
	watch : {
		value : function(val) {
			this.$emit('input', this.value);
		}
	},
	methods : {
        addFont : function() {
        }
	}
});