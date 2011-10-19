
var mod = function( ex, ObjectWebService )
{

function DomainElement() {}

DomainElement.prototype = new ObjectWebService() ;


DomainElement.prototype.init = function( id, object, domainServer )
	{
	 var self = this ;
	
	 ObjectWebService.prototype.init.apply( this, arguments ) ;
	
	 // object.DomainElement = this ;
	
	 ex.setEmbedded( object, DomainElement.prototype, this ) ;
	 
	
	 this.changedSinceLastBroadcast = true ;
	
	
	 this.functions = {} ;
	
	
	 return this ;
	} ;


DomainElement.prototype.broadcastInterface = function( interface )
	{
	 for( var member in interface )
	 	{
		 this.broadcastFunction( member ) ;
		} 
	} ;




	
DomainElement.prototype.encodeToObject = function()
	{
	
	 var obj = {} ;
	
	 var encoded = {id: this.id, prototypeName: this.prototypeName, object: obj } ;
	
	 var nextVal ;
	
	 for( var member in this.object )
		{
		 nextVal = this.object[ member ] ;
		
		 obj[ member ] = this.encodeMember( nextVal ) ;
		}
	
	
	 obj.____embedded = this.encodeEmbedded() ;
//	 encoded.PrototypeName = this.object.constructor.name ;
	
	 return encoded ;
	} ;


DomainElement.prototype.encodeEmbedded = function()
	{
	 var ____embedded = {} ; var embedded ;
	
	 for( var i in this.object.____embedded )	
		{
		 embedded = this.object.____embedded[ i ] ;
			
		 if( ex.getEmbedded( embedded, DomainElement.prototype ) )
			____embedded[ i ] = { id: ex.getEmbedded( embedded, DomainElement.prototype ).id } ;
		}
		
	 return ____embedded ;
	} ;

var depth = 0 ;
DomainElement.prototype.encodeMember = function( nextVal )
	{
	 console.log( 'encode member ' + depth ) ; depth++ ;
	 if( !(nextVal instanceof Object ) && !( nextVal instanceof Function ) &&!( nextVal instanceof Array ) )
		{
		 depth-- ;
		 return nextVal ;
		}
	 else if( ex.getEmbedded( nextVal, DomainElement.prototype ) )
		{
		 depth-- ;
		 console.log( 'domain element ' ) ;
		 return { id: ex.getEmbedded( nextVal, DomainElement.prototype ).id } ;
		}
	 else if( nextVal instanceof Array )
		{
		 console.log( 'array' ) ;
		 var array = [] ;	
		
		 for( var i in nextVal )
			{				
			 array[ i ] = this.encodeMember( nextVal[ i ] ) ;
			}
		
		 depth--;
		 return array ;
		}
	 else console.log( 'other' ) ;
	
		depth-- ;
		 console.log( 'encode member done' ) ;
	} ;

return DomainElement ;
} ;


define( [ 'extend', './ObjectWebService.js' ], mod ) ;