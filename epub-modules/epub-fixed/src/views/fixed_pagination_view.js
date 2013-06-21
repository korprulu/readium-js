EpubFixed.FixedPaginationView = Backbone.View.extend({

	el : "<div class='fixed-pages-view' style='position:relative;'> \
            <div class='fixed-spine-divider'></div> \
          </div>",

	// ------------------------------------------------------------------------------------ //
	//  "PUBLIC" METHODS (THE API)                                                          //
	// ------------------------------------------------------------------------------------ //

	initialize : function (options) {

		var that = this;
		this.fixedPageViews = new EpubFixed.FixedPageViews({ spineObjects : options.spineObjects });
		this.viewerSettings = options.viewerSettings;

		// Rationale: Propagate the loaded event after all the content documents are loaded
        this.fixedPageViews.on("epubLoaded", function () {
            that.trigger("contentDocumentLoaded");
            that.$el.css("opacity", "1");
        }, this);

		// this.mediaOverlayController = this.model.get("media_overlay_controller");
        // this.mediaOverlayController.setPages(this.pages);
        // this.mediaOverlayController.setView(this);

        // this.mediaOverlayController.on("change:mo_text_id", this.highlightText, this);
        // this.mediaOverlayController.on("change:active_mo", this.indicateMoIsPlaying, this);
	},

	render : function (goToLastPage, hashFragmentId) {

		this.fixedPageViews.renderFixedPages(this.$el[0], this.viewerSettings, this.linkClickHandler, this);
		return this.el;
	},

    // REFACTORING CANDIDATE: Might want these methods to be the goLeft and goRight methods, 
    //   Also, at the moment, the page-turn events are triggered from the delegate, as well as 
    //   checking of page boundry conditions. Not sure if this makes sense, or if it would be clearer
    //   if that stuff was in these two methods instead. 
	nextPage : function () {

		this.fixedPageViews.nextPage(this.viewerSettings.syntheticLayout, this);
	},

	previousPage : function () {

		this.fixedPageViews.previousPage(this.viewerSettings.syntheticLayout, this);
	},

    setSyntheticLayout : function (isSynthetic) {

        if (isSynthetic && this.viewerSettings.syntheticLayout === false) {
            this.viewerSettings.syntheticLayout = true;
            this.fixedPageViews.setSyntheticLayout(true);
            this.trigger("layoutChanged", true);
        }
        else if (!isSynthetic && this.viewerSettings.syntheticLayout === true) {
            this.viewerSettings.syntheticLayout = false;
            this.fixedPageViews.setSyntheticLayout(false);
            this.trigger("layoutChanged", false);
        }
    },

    showPageNumber : function (pageNumber) {

        var startPageNumbers = this.fixedPageViews.get("currentPages");
        this.fixedPageViews.showPageNumber(pageNumber, this.viewerSettings.syntheticLayout);

        if (startPageNumbers != this.fixedPageViews.get("currentPages")) {
            this.trigger("displayedContentChanged");    
        }
    },

    showPagesView : function () {

        var currentPageNumber = this.fixedPageViews.get("currentPages")[0];
        this.$el.show();
        this.fixedPageViews.showPageNumber(currentPageNumber, this.viewerSettings.syntheticLayout);
    },

    hidePagesView : function () {

        this.$el.hide();
        this.fixedPageViews.hidePageViews();
    },

    resizePageViews : function () {

        this.fixedPageViews.resizePageViews();
        this.trigger("displayedContentChanged");
    },
    
 //    // override
	// indicateMoIsPlaying: function () {
	// 	var moHelper = new Readium.Models.MediaOverlayViewHelper({epubController : this.model});
	// 	moHelper.renderFixedMoPlaying(
	// 		this.pages.get("current_page"),
	// 		this.mediaOverlayController.get("active_mo"),
	// 		this
 //        );
	// },
    
 //    // override
	// highlightText: function () {
	// 	var moHelper = new Readium.Models.MediaOverlayViewHelper({epubController : this.model});
	// 	moHelper.renderFixedLayoutMoFragHighlight(
	// 		this.pages.get("current_page"),
	// 		this.mediaOverlayController.get("mo_text_id"),
	// 		this
 //        );
	// },
    
 //    // override
 //    // Description: return the set of all elements for this spine item that have an @id attribute.
 //    // Used by MO.
 //    getAllPageElementsWithId: function() {
 //        return $('body').find("[id]");
 //    },
    
    
	// ------------------------------------------------------------------------------------ //
	//  "PRIVATE" HELPERS                                                                   //
	// ------------------------------------------------------------------------------------ //

	destruct : function () {

        this.off("epubLoaded");
        // this.mediaOverlayController.off("change:mo_text_id", this.highlightText);
        // this.mediaOverlayController.off("change:active_mo", this.indicateMoIsPlaying);
	},

    linkClickHandler : function (e) {

        this.trigger("internalLinkClicked", e);
    }

	// setFontSize: function() {
	// 	var size = this.model.get("font_size") / 10;
	// 	$('#readium-content-container').css("font-size", size + "em");
	// 	this.showCurrentPages();
	// },

	// applyKeydownHandler : function ($pageViewContainer) {

	// 	var that = this;
	// 	$pageViewContainer.contents().keydown(function (e) {

	// 		if (e.which == 39) {
	// 			that.pages.goRight(); // Have to get ppd and two up
	// 		}
							
	// 		if (e.which == 37) {
	// 			that.pages.goLeft(); // Have to get ppd and two up
	// 		}
	// 	});
	// }
});