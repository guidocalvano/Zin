
var mod = function( extend, DomainElementShadow )
{
var after   = extend.after  ;
var before  = extend.before ;
var key		= extend.key	;

function DomainClient() {} 

DomainClient.prototype.init = function( serverConnection )
	{
	 this.idToElement = {} ;
	
	 this.initFunctionSet = {} ;
	
	 this.constructorFunctionsByName = {} ;
	
	 this.remoteKeyToLocalKey = {} ;
		
	 this.serverConnection = serverConnection ;
	 
	 after( this.serverConnection, "receive", this, "receive" ) ;
	
	 return this ;
	} ;
	
DomainClient.prototype.addConstructorFunction = function( name, constructorFunction )
	{
	 this.constructorFunctionsByName[ name  ] = constructorFunction ; 
	} ;
	
		
DomainClient.prototype.getElement = function( id ) { return this.idToElement[ id ] ; } ;

DomainClient.prototype.setElement = function( id, element ) { this.idToElement[ id ] = element ; } ;


DomainClient.prototype.receive = function( data, newMessage )
	{	
//	 var receiver ;
//	 var nextObj ;


	 console.log( 'RECEIVING MESSAGE ' ) ;

	 if( newMessage.type == "initialize" )
		
		 this.initialize( newMessage ) ;
	 
	
	 if( newMessage.type == "call" )
		{
		 console.log( "CALL: " + JSON.stringify( newMessage ) ) ;
		
		 this.idToElement[ newMessage.id ].execute( newMessage ) ;
		}

	} ;

DomainClient.prototype.initialize = function( newMessage )
	{
	 this.initializeConstructorFunctions( newMessage.constructorFunctions 	) ;
	 this.initializeElements( 	newMessage.elements 	) ;
	} ;

DomainClient.prototype.initializeConstructorFunctions = function( constructorFunctions )
	{
	 var i = 0 ;
	 for( var name in constructorFunctions )
		{
		i++ ;
		 this.remoteKeyToLocalKey[ constructorFunctions[ name ].____key ] = key( this.constructorFunctionsByName[ name ].prototype ) ;
		
		 console.log( name + ' remote key: ' + constructorFunctions[ name ].____key + ' local key ' + key( this.constructorFunctionsByName[ name ].prototype  ) ) ;
		} 
		
		
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
	 var object = new this.constructorFunctionsByName[ elementObj.prototypeName ]() ;
		
	 var element = ( new DomainElementShadow() ).init( elementObj.id, object, this ) ;
	
	 if( object.constructor.name == 'Agent' ) 
		{
		 console.log( 'AGENT' ) ;
			
		 for( var e in object.____embedded ) console.log( e + ': ' + object.____embedded[ e ] + ' ' + object.____embedded[ e ].constructor.name ) ;
		
		 console.log( 'des id ' + object.____embedded[ key( DomainElementShadow.prototype ) ].id ) ; 
		
		// console.log( 'ows ' + key( ObjectWebService.prototype ) ) ;

		 console.log( 'des ' + key( DomainElementShadow.prototype ) ) ;
			
		 // process.exit( 0 ) ;	
		} ;
	
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

/*
DomainClient.prototype.addPrototype = function( prototype, init )
	{
	 this.factoryByPrototype[ prototype.constructor.name  ] = function() { return new prototype.constructor() ; }  ;	
	
	 prototype.DomainClientBackpack = { init: function( obj ) { init( obj ) ; } } ;
	} ;
*/	
	
DomainClient.prototype.send = function( data )
	{
	 this.serverConnection.send( data ) ;	
	} ;
	
return DomainClient ;
} ;


define( [ 'extend', './DomainElementShadow.js' ], mod ) ;