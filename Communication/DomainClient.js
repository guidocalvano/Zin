

var mod = function( extend, DomainElementShadow )
{
var after  = extend.after  ;
var before = extend.before ;

function DomainClient() {} 

DomainClient.prototype.init = function( serverConnection )
	{
	 this.idToElement = {} ;
	
	 this.initFunctionSet = {} ;
	
	 this.factoryByPrototype = {} ;
	
	 // var serverConnection = ( new serverConnection.ServerConnection() ).init( port, host ) ;
	
	 this.serverConnection = serverConnection ;
	 
	 console.log( 'ex.after( this.serverConnection, "receive", this, "receive" ) ;') ;
	 after( this.serverConnection, "receive", this, "receive" ) ;
	
	 return this ;
	} ;
	

	
		
DomainClient.prototype.getElement = function( id ) { return this.idToElement[ id ] ; } ;

DomainClient.prototype.setElement = function( id, element ) { this.idToElement[ id ] = element ; } ;


DomainClient.prototype.receive = function( data, newMessage )
	{	
//	 var receiver ;
//	 var nextObj ;


	 console.log( 'RECEIVING MESSAGE ' + data + ' obj: ' + newMessage ) ;

	 if( newMessage.type == "initialize" )
	
		 this.initializeElements( newMessage.elements ) ;
	
	
	 
	
	 if( newMessage.type == "call" )
		{
		 console.log( "CALL: " + JSON.stringify( newMessage ) ) ;
		 this.idToElement[ newMessage.id ].execute( newMessage ) ;
		}
	

	/*
	 if( newMessage.type == "DomainUpdate" )
		{

		}
		
	*/
	} ;


DomainClient.prototype.createElementsIfNotExist = function( elements )
	{
	 var id ;
		
	 var element ;
	
		
	 for( var i in elements )
		{
		 element = elements[ i ] ;	
						
		 if( ! this.get( element.id ) )
			this.construct( element ) ;	
		}
	} ;


DomainClient.prototype.construct = function( elementObj )
	{
	 var object = {} ; // this.factoryByPrototype[ elementObj.prototypeName ]() ;
	
	 var element = ( new DomainElementShadow() ).init( elementObj.id, object, this ) ;
	
	 this.setElement( element.id, element ) ;
	
	 return element ;
	} ;


DomainClient.prototype.initializeElements = function( elements )
	{
	
	 console.log( 'INITIALIZE ELEMENTS' ) ;
	
	 var nextElement ;

 	 var objectSet = [] ;

	 for( var i in elements )
		{
		 nextElement = this.construct( elements[ i ] ) ;
		 objectSet.push( nextElement.object ) ;
		}
	
	 for( var j in elements )
			
		 this.idToElement[ elements[ j ].id ].decodeFromObject( elements[ j ] ) ;


	 for( var k in elements )

		this.idToElement[ elements[ k ].id ].stateInitialized() ;
	
	 return objectSet ;			
	} ;

DomainClient.prototype.addInitFunction = function( name, newInitFunction )
	{
	 this.initFunctionSet[ name ] = newInitFunction ;	
	} ;
	
	
DomainClient.prototype.removeInitFunction = function( name )
	{
	 delete this.initFunctionSet[ name ] ;	
	} ;



DomainClient.prototype.setInitializer = function( prototypeName  )
	{
	 this.initializer = prototypeName ;	
	}

	
DomainClient.prototype.addPrototype = function( prototype, init )
	{
	 this.factoryByPrototype[ prototype.constructor.name  ] = function() { return new prototype.constructor() ; }  ;	
	
	 prototype.DomainClientBackpack = { init: function( obj ) { init( obj ) ; } } ;
	} ;
	
	
DomainClient.prototype.send = function( data )
	{
	 this.serverConnection.send( data ) ;	
	} ;
	
return DomainClient ;
} ;


define( [ 'extend', './DomainElementShadow.js' ], mod ) ;