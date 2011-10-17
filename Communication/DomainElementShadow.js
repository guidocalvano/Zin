var mod = function( ObjectWebService )
{

function DomainElementShadow() {}

DomainElementShadow.prototype = new ObjectWebService() ;

DomainElementShadow.prototype.init = function( id, object, domainClient )
	{
	 ObjectWebService.prototype.init.apply( this, arguments ) ;
		
	 // this.id 	 = id 		;
	 // this.object = object 	;
	
	 this.domainClient = domainClient ;
	
	 this.object.DomainElementShadow = this ;
	
	 return this ;
	} ;
	
	
DomainElementShadow.prototype.decodeFromObject = function( that )
	{
	 var nextVal ;
	
//	 var obj = this.object ;
	
	 this.object.__proto__ = this.domainClient.getElement( that[ 'prototypeElement'].id ) ;
	
	 for( var member in that.object )
		{
		 console.log( 'member: ' + member ) ;
		 this.object[ member ] = this.decodeMember( that.object[ member ] ) ;
		}	
	} ;

DomainElementShadow.prototype.decodeMember = function( obj )
	{
	 if( obj instanceof Array )	
		{
	
		 var array = new Array( obj.length ) ;
		
		 for( var i in obj )	
			{
			 array[ i ] = this.decodeMember( obj[ i ] ) ;
			}
			
		 // console.log( 'array ' + JSON.stringify( array ) ) ;
		 console.log( 'obj' + obj ) ;
		
		 return array ;
		}
		
	 if( obj instanceof Object )
		{
		 console.log( 'object ' + obj.id ) ;		
		 console.log( 'object ' + obj.id ) ;		
		 console.log( 'object ' + obj.id ) ;		
		 console.log( 'object ' + obj.id ) ;		
			
		 return this.domainClient.getElement( obj.id ).object ;
		}

	 console.log( 'primitive ' + obj ) ;		

		
	 return obj ;
	} ;


DomainElementShadow.prototype.stateInitialized = function() 
	{		
	} ;

return DomainElementShadow ;

} ;


define( [ './ObjectWebService.js' ], mod ) ;