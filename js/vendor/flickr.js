
var snappi = snappi || {};

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function forEach( callback, thisArg ) {

    var T, k;

    if ( this == null ) {
      throw new TypeError( "this is null or not defined" );
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ( {}.toString.call(callback) !== "[object Function]" ) {
      throw new TypeError( callback + " is not a function" );
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if ( arguments.length >= 2 ) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while( k < len ) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if ( k in O ) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call( T, kValue, k, O );
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

/**
 * @preserve Knuth and Plass line breaking algorithm in JavaScript
 * 
 * https://github.com/bramstein/typeset
 * 
 * Licensed under the new BSD License.
 * Copyright 2009-2010, Bram Stein
 * All rights reserved.
 */
if("undefined"===typeof Typeset){var Typeset={}}Typeset.LinkedList=(function(undefined){function LinkedList(){this.head=null;this.tail=null;this.listSize=0}LinkedList.Node=function(data){this.prev=null;this.next=null;this.data=data};LinkedList.Node.prototype.toString=function(){return this.data.toString()};LinkedList.prototype.isLinked=function(node){return !((node&&node.prev===null&&node.next===null&&this.tail!==node&&this.head!==node)||this.isEmpty())};LinkedList.prototype.size=function(){return this.listSize};LinkedList.prototype.isEmpty=function(){return this.listSize===0};LinkedList.prototype.first=function(){return this.head};LinkedList.prototype.last=function(){return this.last};LinkedList.prototype.toString=function(){return this.toArray().toString()};LinkedList.prototype.toArray=function(){var node=this.head,result=[];while(node!==null){result.push(node);node=node.next}return result};LinkedList.prototype.forEach=function(fun){var node=this.head;while(node!==null){fun(node);node=node.next}};LinkedList.prototype.contains=function(n){var node=this.head;if(!this.isLinked(n)){return false}while(node!==null){if(node===n){return true}node=node.next}return false};LinkedList.prototype.at=function(i){var node=this.head,index=0;if(i>=this.listLength||i<0){return null}while(node!==null){if(i===index){return node}node=node.next;index+=1}return null};LinkedList.prototype.insertAfter=function(node,newNode){if(!this.isLinked(node)){return this}newNode.prev=node;newNode.next=node.next;if(node.next===null){this.tail=newNode}else{node.next.prev=newNode}node.next=newNode;this.listSize+=1;return this};LinkedList.prototype.insertBefore=function(node,newNode){if(!this.isLinked(node)){return this}newNode.prev=node.prev;newNode.next=node;if(node.prev===null){this.head=newNode}else{node.prev.next=newNode}node.prev=newNode;this.listSize+=1;return this};LinkedList.prototype.push=function(node){if(this.head===null){this.unshift(node)}else{this.insertAfter(this.tail,node)}return this};LinkedList.prototype.unshift=function(node){if(this.head===null){this.head=node;this.tail=node;node.prev=null;node.next=null;this.listSize+=1}else{this.insertBefore(this.head,node)}return this};LinkedList.prototype.remove=function(node){if(!this.isLinked(node)){return this}if(node.prev===null){this.head=node.next}else{node.prev.next=node.next}if(node.next===null){this.tail=node.prev}else{node.next.prev=node.prev}this.listSize-=1;return this};LinkedList.prototype.pop=function(){var node=this.tail;this.tail.prev.next=null;this.tail=this.tail.prev;this.listSize-=1;node.prev=null;node.next=null;return node};LinkedList.prototype.shift=function(){var node=this.head;this.head.next.prev=null;this.head=this.head.next;this.listSize-=1;node.prev=null;node.next=null;return node};return LinkedList})();Typeset.linebreak=(function(){var linebreak=function(nodes,lines,settings){var options={demerits:{line:settings&&settings.demerits&&settings.demerits.line||10,flagged:settings&&settings.demerits&&settings.demerits.flagged||100,fitness:settings&&settings.demerits&&settings.demerits.fitness||3000},tolerance:settings&&settings.tolerance||2},activeNodes=new Typeset.LinkedList(),sum={width:0,stretch:0,shrink:0},lineLengths=lines,breaks=[],tmp={data:{demerits:Infinity}};function breakpoint(position,demerits,ratio,line,fitnessClass,totals,previous){return{position:position,demerits:demerits,ratio:ratio,line:line,fitnessClass:fitnessClass,totals:totals||{width:0,stretch:0,shrink:0},previous:previous}}function computeCost(start,end,active,currentLine){var width=sum.width-active.totals.width,stretch=0,shrink=0,lineLength=currentLine<lineLengths.length?lineLengths[currentLine-1]:lineLengths[lineLengths.length-1];if(nodes[end].type==="penalty"){width+=nodes[end].width}if(width<lineLength){stretch=sum.stretch-active.totals.stretch;if(stretch>0){return(lineLength-width)/stretch}else{return linebreak.infinity}}else{if(width>lineLength){shrink=sum.shrink-active.totals.shrink;if(shrink>0){return(lineLength-width)/shrink}else{return linebreak.infinity}}else{return 0}}}function computeSum(breakPointIndex){var result={width:sum.width,stretch:sum.stretch,shrink:sum.shrink},i=0;for(i=breakPointIndex;i<nodes.length;i+=1){if(nodes[i].type==="glue"){result.width+=nodes[i].width;result.stretch+=nodes[i].stretch;result.shrink+=nodes[i].shrink}else{if(nodes[i].type==="box"||(nodes[i].type==="penalty"&&nodes[i].penalty===-linebreak.infinity&&i>breakPointIndex)){break}}}return result}function mainLoop(node,index,nodes){var active=activeNodes.first(),next=null,ratio=0,demerits=0,candidates=[],badness,currentLine=0,tmpSum,currentClass=0,fitnessClass,candidate,newNode;while(active!==null){candidates=[{demerits:Infinity},{demerits:Infinity},{demerits:Infinity},{demerits:Infinity}];while(active!==null){next=active.next;currentLine=active.data.line+1;ratio=computeCost(active.data.position,index,active.data,currentLine);if(ratio<-1||(node.type==="penalty"&&node.penalty===-linebreak.infinity)){activeNodes.remove(active)}if(-1<=ratio&&ratio<=options.tolerance){badness=100*Math.pow(Math.abs(ratio),3);if(node.type==="penalty"&&node.penalty>=0){demerits=Math.pow(options.demerits.line+badness+node.penalty,2)}else{if(node.type==="penalty"&&node.penalty!==-linebreak.infinity){demerits=Math.pow(options.demerits.line+badness-node.penalty,2)}else{demerits=Math.pow(options.demerits.line+badness,2)}}if(node.type==="penalty"&&nodes[active.data.position].type==="penalty"){demerits+=options.demerits.flagged*node.flagged*nodes[active.data.position].flagged}if(ratio<-0.5){currentClass=0}else{if(ratio<=0.5){currentClass=1}else{if(ratio<=1){currentClass=2}else{currentClass=3}}}if(Math.abs(currentClass-active.data.fitnessClass)>1){demerits+=options.demerits.fitness}demerits+=active.data.demerits;if(demerits<candidates[currentClass].demerits){candidates[currentClass]={active:active,demerits:demerits,ratio:ratio}}}active=next;if(active!==null&&active.data.line>=currentLine){break}}tmpSum=computeSum(index);for(fitnessClass=0;fitnessClass<candidates.length;fitnessClass+=1){candidate=candidates[fitnessClass];if(candidate.demerits<Infinity){newNode=new Typeset.LinkedList.Node(breakpoint(index,candidate.demerits,candidate.ratio,candidate.active.data.line+1,fitnessClass,tmpSum,candidate.active));if(active!==null){activeNodes.insertBefore(active,newNode)}else{activeNodes.push(newNode)}}}}}activeNodes.push(new Typeset.LinkedList.Node(breakpoint(0,0,0,0,0,undefined,null)));nodes.forEach(function(node,index,nodes){if(node.type==="box"){sum.width+=node.width}else{if(node.type==="glue"){if(index>0&&nodes[index-1].type==="box"){mainLoop(node,index,nodes)}sum.width+=node.width;sum.stretch+=node.stretch;sum.shrink+=node.shrink}else{if(node.type==="penalty"&&node.penalty!==linebreak.infinity){mainLoop(node,index,nodes)}}}});if(activeNodes.size()!==0){activeNodes.forEach(function(node){if(node.data.demerits<tmp.data.demerits){tmp=node}});while(tmp!==null){breaks.push({position:tmp.data.position,ratio:tmp.data.ratio});tmp=tmp.data.previous}return breaks.reverse()}return[]};linebreak.infinity=10000;linebreak.glue=function(width,stretch,shrink){return{type:"glue",width:width,stretch:stretch,shrink:shrink}};linebreak.box=function(width,value){return{type:"box",width:width,value:value}};linebreak.penalty=function(width,penalty,flagged){return{type:"penalty",width:width,penalty:penalty,flagged:flagged}};return linebreak})();

	

(function() {//Closure, to not leak to the scope
	
	




var ImageMontage = function(cfg){
	this.cfg = {};
	this.init(cfg);
	ImageMontage.instance = this;
	return this;
}	
// static method
ImageMontage.instance = null;
ImageMontage.render = function(thumbs, cfg){
	/*
	 * this is the entrypoint into the imagemontage render
	 */
	if (!!ImageMontage.instance) {
		ImageMontage.instance.cfg.initialThumbs = thumbs;
		ImageMontage.instance.renderAll(cfg.page, cfg.page===1, ImageMontage.instance);
		ImageMontage.instance.cfg.page = cfg.page; 
	} else {
		var PERPAGE = 32; 
		// called once, use xhr_fetch
		var defaults = {
			url: window.location.pathname, 
			container: '.gallery',
			perpage: cfg.perpage || PERPAGE,
		};
		cfg = $.extend(defaults, cfg);
	
		
		var named = snappi.mixins.Href.getNamedParams(cfg.url);
		if (named.page) cfg.page = named.page;
		if (named.perpage) cfg.perpage = named.perpage;
		if (named.size) cfg.targetHeight = named.size;
	
		cfg.initialThumbs = thumbs;	// from GalleryView.render(0)
		ImageMontage.instance = new ImageMontage(cfg);
		ImageMontage.instance.show();  // calls renderAll(1)	
	}
}


ImageMontage.prototype = {
	init: function(cfg){
		/*
		 * p-code
		 * - snappi.ImageMontage.render(parent.children(), cfg);
		 * - call renderAll()
		 * - if cfg.initialThumbs, or  xhr_fetch on new page
		 * 		_prepareLayout()
		 * 		_layoutThumbs()
		 * 			lineBreak()
		 * 			lines.forEach()
		 * onContainerScroll
		 * - changePage()
		 * - renderAll()
		 */
		var viewOptions = {
	        paginated: false,
	        // allowPaginatedToggle: false,
	        outerContainerSelector: cfg.container || '.gallery',
	        thumbsContainerSelector: '.body',
	        thumbsMessageContainerSelector: '.gallery .paging_message',
	        constrainedWithinWindow: true,
	        // allowArrange: true,
	        // photoClickFunction: null,
	    };
	    var layoutOptions = {
			// Image montage settings:
            targetHeight: 160, // Each row of images will be at least this high
            targetWidth: 940, // Set large enough to accomodate the odd image that spans the entire screen width
            thumbsPerFetch: cfg.perpage || 15, // How many images to fetch in a batch for endless scrolling pages
            // thumbsPerPage: 30, // How many images per page when pagination is turned on
            showCaptions: true, // Should we overlay captions on top of images?
            space : {
				width: 15, // What spacing should we try to achieve between images
				stretch: 35, // How many pixels should the gap between images grow by at most?
				shrink: 50 // How many pixels should we allow that gap to shrink by (it can safely end up negative! images will have edges cropped) 
			},
			maxVertScale: 1.4 //What is the largest factor we should scale lines by vertically to fill gaps?
	    }
	    this.cfg = $.extend(viewOptions, layoutOptions, cfg);
	    if (!this.cfg.url) this.cfg.url = window.location.href;
	    
       	var _paginated = false;
        var _outerContainer = $(this.cfg.outerContainerSelector);
        var _thumbsContainer = _outerContainer.find(this.cfg.thumbsContainerSelector);
        var _thumbsMessageContainer = $(this.cfg.thumbsMessageContainerSelector);
        
        var _thumbsOnCurrentPage = 0;
        var _totalNumberOfThumbs = parseInt(this.cfg.totalNumberOfThumbs);
        var _totalNumberOfPages = 1;
        var _currentPage = _paginated ? parseInt(this.cfg.currentPage) : 1;
        var _requestInProgress = false;
        var _constrainedWithinWindow = this.cfg.constrainedWithinWindow;
        var _resizeHandlerInitialized = false;
        var _scrollHandlerInitialized = false;
        var _scrolledToEnd = false;
        var _newAlbum = false;
        var _initialRequest = true;
        var _firstShow = true;
	        
        // //IE < 9 does not support stretching backgrounds
        var _supportsBackgroundStretch = ('backgroundSize' in document.documentElement.style);
	        
        var targetHeight = this.cfg.targetHeight;
        var targetWidth = this.cfg.targetWidth;
        // var showCaptions = this.cfg.showCaptions;
        var space = this.cfg.space;
		var maxVertScale = this.cfg.maxVertScale;
	
		// //Fetch higher resolution images for retina displays:
		// var _sourceWidth, _sourceHeight, _sourceSize;
			
		var 
    		_last_layout_container_width = 0,
			_layout_y = 0;
		/**
		 * @param jquery container wrapper around images
		 * @param jquery images jquery array of img objects
		 */		
		var _layoutThumbs = function(container, layout_images, targetHeight) {
    		var 
    			containerWidth = container.outerWidth() - 15,
    			
    			linebreak = Typeset.linebreak;
    		
    		var
    			nodes = [],
    			breaks = [],
    			lines = [],
    			images = [],
    			i, point, r, lineStart = 0,
    			x;
    			
    		var collection = snappi.collections.paginatedGallery;	
    		
    		_outerContainer.addClass('flickrd');
    	
    		for (i = 0; i < layout_images.length; i++) {
    			var img_tag = layout_images.get(i);
    			
    			/*
    			 * get related model
    			 */
    			try {
    				var model = collection.findWhere({id:img_tag.parentNode.parentNode.parentNode.id});
    					thumb = model.toJSON();
    			} catch (ex) {
    				console.error('Model not found for img='+img_tag);
    			}
    			
    				
    			    			
    			var image = {
    				width: thumb.origW / thumb.origH * targetHeight, 
    				height: targetHeight, 
    				model: thumb, 
    				tag: img_tag
    			};
    			
    			images.push(image);
    			
    			nodes.push(linebreak.box(image.width, image));
    	
    			if (i === layout_images.length - 1) {
    				nodes.push(linebreak.penalty(0, -linebreak.infinity, 1));
    			} else {
    				nodes.push(linebreak.glue(space.width, space.stretch, space.shrink));
    			}
    		};
    		
    		// Perform the line breaking
    		breaks = linebreak(nodes, [containerWidth], {tolerance: 100000});
    	
    		// Try again with a higher tolerance if the line breaking failed.
    		if (breaks.length === 0) {
    			breaks = linebreak(nodes, [containerWidth], {tolerance: 1000000});
    			// And again
    			if (breaks.length === 0) {
    				breaks = linebreak(nodes, [containerWidth], {tolerance: 10000000});
    			}
    		}

    		// Build lines from the line breaks found.
    		for (i = 1; i < breaks.length; i++) {
    			point = breaks[i].position,
    			r = breaks[i].ratio;
    	
    			for (var j = lineStart; j < nodes.length; j++) {
    				// After a line break, we skip any nodes unless they are boxes
    				if (nodes[j].type === 'box') {
    					lineStart = j;
    					break;
    				}
    			}
    			lines.push({ratio: r, nodes: nodes.slice(lineStart, point + 1), position: point});
    			lineStart = point;
    		}

    		lines.forEach(function (line) {
    			var	
    				lineImages = [],
    				imagesTotalWidth = 0,
    				lineHeight = 0;

    			// Filter out the spacers to just leave the images:
    			line.nodes.forEach(function (n, index, array) {
    				if (n.type === 'box') {
    					var image = n.value;
    					
    					imagesTotalWidth += image.width;
    					lineHeight = image.height > lineHeight ? image.height : lineHeight;
    					
    					lineImages.push(image);
    				}
    			});
    				
    			if (lineImages.length > 0) {
    				var 
    					spacing = lineImages.length <= 1 ? 0 : (containerWidth - imagesTotalWidth) / (lineImages.length - 1),
    					totalHorzCrop = 0, totalVertCrop = 0,
    					scale = 1;
    				
    				if (lineImages.length > 1) {
	    				// Do we have to crop images to fit on this line?
    					if (spacing < space.width) {
    						//Total up the crop so we can apply it proportionately to the images on the line
    						totalHorzCrop = (lineImages.length - 1) * (space.width - spacing);
    						
    						scale = 1;
    						
    						//We shrink enough that we can get perfect minimum spacing
    						spacing = space.width;
    					} else if (spacing > space.width) {
    						// We have to inflate the images to fit on the line
    						scale = (containerWidth - (lineImages.length - 1) * space.width) / imagesTotalWidth;
    							    						
    						spacing = (containerWidth - imagesTotalWidth * scale) / (lineImages.length - 1);
    					}
    				} else {
    					//Scale up or down (infinitely) to fill the line
    					scale = containerWidth / imagesTotalWidth;
    					spacing = 0;
    				}
    				
					//Do we have to overfill the line vertically in order to fill it horizontally?
					if (scale > maxVertScale) {
						totalVertCrop = lineHeight * scale - targetHeight * maxVertScale;
					}
    				
    				//Now lay out the images
    				x = 0;
    				
    				for (var i = 0; i < lineImages.length; i++) {
    					var 
    						image = lineImages[i],
	    					border = image.tag.parentNode,  // A or DIV
	    					photoBox = image.tag.parentNode.parentNode.parentNode, // LI
	    					imageHorzCrop = 0; 
    					
    					if (totalHorzCrop > 0) {
    						imageHorzCrop = (image.width / imagesTotalWidth) * totalHorzCrop;
    					} else if (scale != 1) {
    						image.width *= scale;
    						image.height *= scale;
    					}

    					image.tag.style.top = '0px';
    					photoBox.style.top = _layout_y + "px";

						if (i == lineImages.length - 1) {
	    					//The rightmost image should be flush with the right margin:
    						x = containerWidth - (image.width - imageHorzCrop);
    					}
							    					
    					photoBox.style.left = x + "px";

						if (!_supportsBackgroundStretch && image.tag.src.indexOf('/img/spacer.gif') > -1) {
							// On IE < 9 we will have to weaken the right click protection slightly by moving the image from the background to the src attribute
							image.tag.src = image.tag.style.backgroundImage.match(/url\((.+)\)/)[1];
							image.tag.style.backgroundImage = "none";
						}

    					if (image.tag.src.indexOf('/img/spacer.gif') > -1) {
	    					image.tag.style.backgroundSize = Math.round(image.width) + 'px ' + Math.round(image.height) + 'px';
	    					image.tag.style.backgroundPosition = -Math.floor(imageHorzCrop / 2) + "px " + -Math.floor(totalVertCrop / 2) + "px";
	    						
	    					image.tag.style.height = Math.round(image.height - totalVertCrop) + "px";
	    					image.tag.style.width = Math.round(image.width - imageHorzCrop) + "px";	    						
    					} else {
	    					image.tag.style.width = Math.round(image.width) + 'px';
	    					image.tag.style.height = Math.round(image.height) + 'px';
	    					
	    					// adjust img src prefix to actual dim
	    					var THUMB_SIZE, 
	    						maxDim = Math.max(image.width, image.height);
							if (maxDim <= 120) THUMB_SIZE='tn';
							else if (maxDim <= 240) THUMB_SIZE='bs';
							else if (maxDim <= 320) THUMB_SIZE='bm';
							else THUMB_SIZE='bp';
							image.tag.src = snappi.mixins.Href.getImgSrc(image.model, THUMB_SIZE, i);
		
    						border.style.height = Math.round(image.height - totalVertCrop) + "px";
    						border.style.width = Math.round(image.width - imageHorzCrop) + "px";
    						
    						image.tag.style.left = -Math.floor(imageHorzCrop / 2) + "px";
    						image.tag.style.top = -Math.floor(totalVertCrop / 2) + "px";
    					}
    					
    					x += image.width - imageHorzCrop + spacing;
    				}
    				
    				_layout_y += lineHeight * scale - totalVertCrop + space.width;
    			}
    		});
    				
    		container.css('height',_layout_y + "px");
    		
    	};		
    	
    	
    	var _relayoutThumbs = function() {
        	if (_thumbsContainer.outerWidth() !=_last_layout_container_width) {
        		_last_layout_container_width = _thumbsContainer.outerWidth();
	        	_layout_y = 0;
	    		_layoutThumbs(_thumbsContainer, _thumbsContainer.find('img'));
        	}
        };
        
    	_relayoutThumbs = Cowboy.throttle(250, _relayoutThumbs);
		
	    /**
         * The main render method for this view.
         * @param int pageNumber - the page number to render
         * @param bool resize - whether or not the container has been resized
         * @param object that - a reference to the intance of the current thumbnail view object.
         */
	    var _renderAll = function(pageNumber, resize, that) {
            _customStartingImageID = '';
            if (resize) _layout_y = 0;
            		            		            
            if((!resize || _firstShow || pageNumber != _currentPage || _newAlbum) && pageNumber <= _totalNumberOfPages && !_requestInProgress) {
            	_firstShow = false;
                _currentPage = pageNumber ? parseInt(pageNumber) : 1;
                _requestInProgress = true;
            	
            	
	            /**
				 * @param jquery addedThumbs, jquery object array of .thumb from ThumbView.render()
				 */		
				var prepareLayout = function(addedThumbs){
			        var photosRemaining = 0;
			        
			        _totalNumberOfThumbs = parseInt(this.cfg.total);
			        // _currentPage = parseInt(this.cfg.page);
			        _totalNumberOfPages = parseInt(this.cfg.pages);
			        
			        if (!addedThumbs) {
			        	addedThumbs = _thumbsContainer.find('.thumb'); 
			        } else {
			        	if(_newAlbum) {
			                _thumbsContainer.html('');
			            }
			            addedThumbs.appendTo(_thumbsContainer);
			        }
			        
			        _thumbsOnCurrentPage += addedThumbs.length;
			        photosRemaining = _totalNumberOfThumbs-_thumbsOnCurrentPage;
			        _requestInProgress = false;
			        
			        if(photosRemaining > 0) {
			            _thumbsMessageContainer.html( photosRemaining + ' photos remaining.');
			        }
			        else {
			            _thumbsMessageContainer.html('');
			        }
			        if(addedThumbs.length) {
			            
			            /* Ensure there is a vertical scrollbar on the body, so that laying out images doesn't cause the image 
			             * container to shrink horizontally, which would invalidate the layout immediately.
			             */
			            var originalOverflowY = document.body.style["overflow-y"];
			            
			            if (originalOverflowY != "scroll") {
			            	document.body.style["overflow-y"] = "scroll";
			            }
			            
			            _layoutThumbs(_thumbsContainer, addedThumbs.find('img'), this.cfg.targetHeight);
			
			            if (originalOverflowY != "scroll") {
			            	document.body.style["overflow-y"] = originalOverflowY;
			            }
			        }
			        else if(_totalNumberOfThumbs == 0) {
			            _thumbsContainer.css('width', '100%');
			            _thumbsContainer.html('This is an empty gallery.');
			            _totalNumberOfPages = 1;
			        }
			        _thumbsContainer.triggerHandler('render');
			        _newAlbum = false;
			        _initialRequest = false;
				}
				
			    var handleFailure = function(o){
			        _requestInProgress = false;
			    }			
            	
            	
                var callback = {
                    'success': prepareLayout,
                    'failure': handleFailure,
                    'scope': that
                };
                
                if (this.cfg.initialThumbs) {
                	// first load from static JSON, 
                	// markup rendered by GalleryView.render()
					callback.success.call(callback.scope, this.cfg.initialThumbs);
					delete this.cfg.initialThumbs;
                }
                else {
                	_thumbsMessageContainer.append( ' Loading more thumbnails...');
                	that.xhr_fetch({page:_currentPage, perpage:that.cfg.thumbsPerFetch}, callback, that);
                }
            }
        }
        this.renderAll = _renderAll;	// expose this method so this.show() has access
        
        this.relayout = function(imgs, targetHeight) {
        	_layout_y = 0;
        	this.cfg.targetHeight = targetHeight;
        	var imgs = imgs || _thumbsContainer.find('img');
    		_layoutThumbs(_thumbsContainer, imgs, this.cfg.targetHeight);
        };
        
        /**
         * Returns the container height
         */
        var _getContainerHeight = function() {
            var height;
            var containerHeight;
            
            if(_constrainedWithinWindow) {
                height = _getWindowHeight();
                containerHeight = height-(_outerContainer.outerHeight());
            }
            else {
                containerHeight = _outerContainer.outerHeight();
            }
            
            return containerHeight;
        };	
        /**
         * Returns the browser window height
         */
        var _getWindowHeight = function() {
            if (window.innerHeight) {
                return window.innerHeight;
            }
            else if (document.documentElement && document.documentElement.clientHeight) {
                return document.documentElement.clientHeight;
            }
            else if (document.body) {
                return document.body.clientHeight;
            }
            
            return 0;
        };
        /**
         * Returns the scrollTop of the container.
         */
        var _getScrollTop = function() {
            
            if(_constrainedWithinWindow) {
                if(window.pageYOffset) {
                    return window.pageYOffset;
                }
                
                if(document.documentElement) {
                    return document.documentElement.scrollTop;
                }
                
                if(document.body) {
                    return document.body.scrollTop;
                }
            }
            else {
                return _outerContainer.scrollTop();
            }           
        };
        var _setScrollTop = function(value) {
	        	
            if(_constrainedWithinWindow) {
                if(window.pageYOffset) {
                    window.pageYOffset = value;
                }
                
                if(document.documentElement) {
                    document.documentElement.scrollTop = value;
                }
                
                if(document.body) {
                    document.body.scrollTop = value;
                }
            }
            else {
                _outerContainer.scrollTop(value);
            }           
        };
        
        /*****************************************
	     * "Public" Methods
	     * 	declare here for access to private vars
	     *****************************************/
        this.removeEventListeners = function() {
	        if(!_paginated) {
	            if(_constrainedWithinWindow) {
	                // YE.removeListener(window, 'scroll', this.onContainerScroll);
	                $(window).off('scroll',this.onContainerScroll);
	            }
	            else {
	                // YE.removeListener(_outerContainer, 'scroll', this.onContainerScroll);
	                _outerContainer.off('scroll',this.onContainerScroll);
	            }
	            
	            _scrollHandlerInitialized = false;
	        }
	   };
	    
	   this.setupEventListeners = function() {
	        if(_constrainedWithinWindow && !_resizeHandlerInitialized) {
	            // YAHOO.util.Event.addListener(window, 'resize', this.onWindowResize, this);
	            $(window).on('resize',$.proxy(this.onWindowResize, this));
	            _resizeHandlerInitialized = true;
	        }
	        
	        if(0 && !_paginated && !_scrolledToEnd && !_scrollHandlerInitialized) {
	            if(_constrainedWithinWindow) {
	                // YAHOO.util.Event.addListener(window, 'scroll', this.onContainerScroll, this);
	                $(window).on('scroll',$.proxy(this.onContainerScroll, this));
	            }
	            else {
	                // YAHOO.util.Event.addListener(_outerContainer, 'scroll', this.onContainerScroll, this);
	                _outerContainer.on('scroll',$.proxy(this.onContainerScroll, this));
	            }
	            
	            _scrollHandlerInitialized = true;
	        }
	        
	        _thumbsContainer.one('render', ImageMontage.onFirstRender);
	        _thumbsContainer.bind('render', ImageMontage.onRender);
		};
        
        
        /**
         * Called on the scroll event of the container element.  Used only in the non-paginated mode.
         * When the scroll threshold is reached a new page of thumbs is requested.
         * @param event e - the scroll event object
         * @param object that - an object reference to the allthumbs view instance.
         */
        this.onContainerScroll = function(e, that) {
        	that = that || this;		// using $.proxy()
            var containerHeight = _thumbsContainer.outerHeight();//_outerContainer.outerHeight;
            var outerContainerHeight = _constrainedWithinWindow? _getWindowHeight() : _outerContainer.outerHeight();//_getWindowHeight()
            var scrollTop = _getScrollTop();
            
            if((containerHeight-scrollTop) <= outerContainerHeight && (_currentPage+1) <= _totalNumberOfPages) {
                that.changePage(_currentPage+1);
            }
            
            if((_currentPage+1) > _totalNumberOfPages && !_initialRequest) {
                if(_constrainedWithinWindow) {
                    // YE.removeListener(window, 'scroll', that.onContainerScroll);
                    $(window).off('scroll',that.onContainerScroll);
                }
                else {
                    // YE.removeListener(_outerContainer, 'scroll', that.onContainerScroll);
                    _outerContainer.off('scroll',that.onContainerScroll);
                }
                
                _scrollHandlerInitialized = false;
                _scrolledToEnd = true;
            }
        };
        
        /**
         * Called on resize of the container.
         */
        this.onWindowResize = function(e, that) {
        	that = that || this;		// using $.proxy()
            that.resize.call(that);
        };
        
        /**
         * Returns the current page
         */
        this.getCurrentPage = function() {
            return _currentPage;
        };
        /**
         * set the request in Progress (from iframe_load)
         */
        this.setRequestInProgress = function(b) {
             _requestInProgress = !!b;
        };
        /**
         * Change gallery page based on finding an image id rather than
         *  a specific page.
         */
        this.changePageWithImage = function(imageID) {
            if(_paginated) {
                _customStartingImageID = imageID;
                _renderAll(_currentPage, false, this);
            }
        };
	    
        /**
         * Change the gallery page.
         */
        this.changePage = function(page) {
        	if (_paginated && _getScrollTop() > _getContainerHeight())
        		_setScrollTop(0);
        	if (0) {
        		// fetch BEFORE renderAll(), before _currentPage updated
        		if (!_requestInProgress) ImageMontage.iframe_fetch({page:page});
        	}  
            else _renderAll(page, false, this);
        };    
        
        
        /**
         * Resize the container.
         */
        this.resize = function() {
        	_relayoutThumbs();
        	
            _renderAll(_currentPage, true, this);
        };
        
        // Set up event listeners   
        this.setupEventListeners();
	},  // end init()
	
	
	show: function() {
        this.renderAll(1, true, this);
    },
    
	/******************************
	 * snappi specific methods 
	 ******************************/
	/**
	 * @param string url
	 * @param object options
	 * @param callback {success:, failure:, scope:} 
	 * @param object that, self-reference
	 */
	XXX_xhr_fetch: function(options, callback, that){
		var named = {}
		if (options.page) named.page = options.page;
		if (options.perpage) named.perpage = options.perpage;
		url = Util.setNamedParams(that.cfg.url, named);
		CFG['util'].getCC(url, function(json){
			// json.success = true
			CFG['util'].parseCC(json.response.castingCall, true);
			var images = that.auditions2objects(CFG['util'].Auditions );
			callback.success.call(callback.scope, images);
		});				
	},
}



ImageMontage.onRender = function() {
	$('body').removeClass('wait');
}

ImageMontage.onFirstRender = function() {
	// console.info("first render");
	var MARGIN_PADDING = 80;
	$('.gallery').css('width','100%').css('max-width', $(window).width()-MARGIN_PADDING+'px');
}


// add to namespace
snappi.ImageMontage = ImageMontage;

})();  
// end module closure