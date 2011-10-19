var mod = function( ex, ObjectWebService )
{

function DomainElementShadow() {}

DomainElementShadow.prototype = new ObjectWebService() ;

DomainElementShadow.prototype.init = function( id, object, domainClient )
	{
	 ObjectWebService.prototype.init.apply( this, arguments ) ;
		
	 // this.id 	 = id 		;
	 // this.object = object 	;
	
	 this.domainClient = domainClient ;
	
	 ex.setEmbedded( object, DomainElementShadow.prototype, this ) ;
	
	 return this ;
	} ;
	
	
DomainElementShadow.prototype.decodeFromObject = function( that )
	{
	 var nextVal ;
	
	 var obj = this.object ;
	
	 for( var member in that.object )
		{		 
		 if( member == '____embedded' )
			{
			 // if( !( this.object[ member ] ) ) this.object[ member ] = {} ;
			 var localizedEmbedded = this.localizeEmbedded( that.object[ member ] ) ;
			
			 for( var e in localizedEmbedded )
			 	this.object[ member ][ e ] = localizedEmbedded[ e ] ; 
			}
		 else
		 	this.object[ member ] = this.decodeMember( that.object[ member ] ) ;
		}	
	} ;


DomainElementShadow.prototype.localizeEmbedded = function( obj )
	{
	 var withLocalizedKeys = {} ;
		
	 // var i = 0 ; var o ;
	 for( var key in obj )
		{
	//	 i++ ;
				
		 withLocalizedKeys[  this.domainClient.remoteKeyToLocalKey[ key ] ] = this.domainClient.getElement( obj[ key ].id ).object ;
		
		 // console.log( 'key: ' + key + ' remote to local: ' + this.domainClient.remoteKeyToLocalKey[ key ] + ' object: ' + this.domainClient.getElement( obj[ key ].id ).object ) ;
		
		 //o = this.domainClient.getElement( obj[ key ].id ).object ;
		
		// for( var z in o ) console.log( z + ': ' + o[z] ) ;
		}
	/*
	 if( i > 0 )
		{
		 process.exit( 0 ) ;	
		}
	*/
	 return withLocalizedKeys ;
	} ;



DomainElementShadow.prototype.decodeMember = function( obj )
	{
	 if( obj instanceof Array )	
		{
		 console.log( 'array ' + JSON.stringify( obj ) ) ;
			
		 var array = new Array( obj.length ) ;
		
		 for( var i in obj )	
			
			 array[ i ] = this.decodeMember( obj[ i ] ) ;
			
					
		 return array ;
		}
		
	 if( obj instanceof Object )
					
		 return this.domainClient.getElement( obj.id ).object ;
		
		
	 return obj ;
	} ;


DomainElementShadow.prototype.stateInitialized = function() 
	{		
	} ;

return DomainElementShadow ;

} ;


define( [ 'extend', './ObjectWebService.js' ], mod ) ; 