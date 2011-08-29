(function($) {
$.fn.hasScrollBar=function(){
	var $this=$(this);
	maxWidth=Math.max(0,$(this).outerWidth(true));
	return maxWidth>$this.width();
}
$.verTrunc=function(data,dest,targetClass){
	$('<textarea />').attr("id",dest+"TA").addClass(targetClass).width($('#'+dest).parent().width()+18).height($('#'+dest).parent().height()+18).appendTo("#vertruncWrapper").val($.trim(data)).html($.trim(data)).text($.trim(data));
	dest='#'+dest;
	debug("Temp TA:"+dest+"TA"+"\nDest: "+dest);
	condensedLength=false;
	loopCnt=0;
	$(dest).doTimeout(5,function(){
		taId="#"+this.attr("id")+"TA";
		condensedLength=(condensedLength)?condensedLength-8:$(taId).val().length-8;
		if(loopCnt==0){
			debug("Starting: Temp TA:"+taId+"\nDest: "+this.attr("id"));
			loopCnt++;
		}
		if(!$(taId).hasScrollBar()){
			debug("Temp TA:"+taId+" is short enough.\nWriting to: "+this.attr("id"));
			$(taId).val($.trim($(taId).val().substring(0,(findDelimiterLocation($(taId).val(), " ",(condensedLength))+1)))+"...");
			this.html($(taId).val()).removeClass("loading");
			condensedLength=false;
			return false;
		}
		debug("Temp TA:"+taId+" is still too long.\nLooping again...");
		$(taId).val($.trim($(taId).val().substring(0,(findDelimiterLocation($(taId).val()," ", (condensedLength))+1))));
		return true;
	});
}
function findDelimiterLocation(html, delim, startpos){
    var foundDelim = false;
    var loc = startpos;    
    do {
      var loc = html.indexOf(delim, loc);
      if (loc < 0){
        debug ("No delimiter found.");
        return html.length;
      }
      foundDelim = true;
    }while(!foundDelim)
    debug ("Delimiter found in html at: "+loc);
    return loc;
}
var safetyRamp=0;
function debug($obj){
	if(window.console && window.console.log){
		if(safetyRamp>400){
			window.console.log("Runaway script.....");
			window.fakeFuncErr();
		}
		else{
			window.console.log($obj);
			safetyRamp++;
		}
	}
}

  // The following code reused from:
  /*!
 * jQuery doTimeout: Like setTimeout, but better! - v1.0 - 3/3/2010
 * http://benalman.com/projects/jquery-dotimeout-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
	'$:nomunge';
	var cache = {},
    doTimeout = 'doTimeout',
    aps = Array.prototype.slice;
	$[doTimeout] = function() {
    return p_doTimeout.apply( window, [ 0 ].concat( aps.call( arguments ) ) );
  };
  $.fn[doTimeout] = function() {
    var args = aps.call( arguments ),
      result = p_doTimeout.apply( this, [ doTimeout + args[0] ].concat( args ) );
    return typeof args[0] === 'number' || typeof args[1] === 'number'
      ? this
      : result;
  };
  function p_doTimeout( jquery_data_key ) {
    var that = this,
      elem,
      data = {},
      method_base = jquery_data_key ? $.fn : $,
      args = arguments,
      slice_args = 4,
      id        = args[1],
      delay     = args[2],
      callback  = args[3];
    if ( typeof id !== 'string' ) {
      slice_args--; 
      id        = jquery_data_key = 0;
      delay     = args[1];
      callback  = args[2];
    }
    if ( jquery_data_key ) {
      elem = that.eq(0);
      elem.data( jquery_data_key, data = elem.data( jquery_data_key ) || {} );
    } else if ( id ) {
      data = cache[ id ] || ( cache[ id ] = {} );
    }
    data.id && clearTimeout( data.id );
    delete data.id;
    function cleanup() {
      if ( jquery_data_key ) {
        elem.removeData( jquery_data_key );
      } else if ( id ) {
        delete cache[ id ];
      }
    };
    function actually_setTimeout() {
      data.id = setTimeout( function(){ data.fn(); }, delay );
    };
    if ( callback ) {
      data.fn = function( no_polling_loop ) {
        if ( typeof callback === 'string' ) {
          callback = method_base[ callback ];
        }
        callback.apply( that, aps.call( args, slice_args ) ) === true && !no_polling_loop
          ? actually_setTimeout()
          : cleanup();
      };
      actually_setTimeout();
    } else if ( data.fn ) {
      delay === undefined ? cleanup() : data.fn( delay === false );
      return true;
    } else {
      cleanup();
    }
  };
})(jQuery);