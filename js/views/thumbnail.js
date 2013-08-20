// /js/views/thumbnail.js

(function ( views ) {
	

/*
 * View: Photo
 * properties:
 * methods:
 */
views.ThumbView = Backbone.View.extend({
	tagname: "div",
	
	template_source: "#markup #ThumbTemplate.handlebars",
	
	events: {
		
	},
	
	initialize: function(){
		if(!($.isFunction(this.template))) {
			var source = $(this.template_source).html();	
			// compile once, add to Class
			views.ThumbView.prototype.template = Handlebars.compile(source);
	    }
	},
	
	render: function(){
		this.$el.html( this.template( this.model.toJSON() ) );
		return this;
	},
});

})( snappi.views );