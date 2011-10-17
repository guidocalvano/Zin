
var mod = function( ObjectWebService )
{

function DomainElement() {}

DomainElement.prototype = new ObjectWebService() ;


DomainElement.prototype.init = function( id, object, domainServer )
	{
	 var self = this ;
	
	 ObjectWebService.prototype.init.apply( this, arguments ) ;
	
	 object.DomainElement = this ;
	
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
	 console.log( 'callled') ;
	
	 var obj = {} ;
	
	 var encoded = {id: this.id, prototypeElement: { id: this.__proto__.DomainElement.id }, object: obj } ;
	
	 var nextVal ;
	
	 for( var member in this.object )
		{
		 nextVal = this.object[ member ] ;
		
		 obj[ member ] = this.encodeMember( nextVal ) ;
		}
	
//	 encoded.PrototypeName = this.object.constructor.name ;
	
	 return encoded ;
	} ;


DomainElement.prototype.encodeMember = function( nextVal )
	{
	 if( !(nextVal instanceof Object ) && !( nextVal instanceof Function ) &&!( nextVal instanceof Array ) )
		 return nextVal ;
	 else if( nextVal.DomainElement )
		 return { id: nextVal.DomainElement.id } ;
	 else if( nextVal instanceof Array )
		{
		 var array = [] ;	
		
		 for( var i in nextVal )
			{				
			 array[ i ] = this.encodeMember( nextVal[ i ] ) ;
			}
			
		 return array ;
		}
		
	} ;

return DomainElement ;
} ;


define( [ './ObjectWebService.js' ], mod ) ;