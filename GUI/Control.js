var moduleHolder = {} ;

var mod = function( ex )
	{
	 var Control = function() {} ;
	
	 ex.key( Control.prototype ) ;
	 
	
	 Control.module = moduleHolder.mod ;
	 return Control ;
	} ;
	

moduleHolder.mod = mod ;

define( ['extend'], mod ) ;