

var server = require( './Server.js' ) ;

var serverConnection = require( './ServerConnection.js' ) ;

var ex = require( 'extend' ) ;

function DomainClient() {} 

function DomainElement() {}

function DomainElementShadow() {}

function DomainServer() {}

function ObjectReceiver() {}


function DomainWebService() {} 

DomainWebService.prototype.init = function()
	{
	 return this ;	
	} ;


DomainServer.prototype.init = function( server )
	{
	 this.highestId = -1 ;
	
	 this.recyclableIdSet = {} ;
	 this.recyclableIdCount = 0 ;	
	
	 this.elementSet = {} ;
	
	 this.domainClientSet = [] ;
	
	 this.server = server ;
	
	 ex.after( server, 'receive', this, 'receive' ) ;
			
	 return this ;
	} ;


DomainServer.prototype.addClient = function( client )
	{
	 this.domainClientSet.push( client ) ;
	
	 this.sendClientInitialState( client ) ;	
	
	 this.added = "yup" ;
	
	 console.log( 'client added' ) ;
	} ;


DomainServer.prototype.sendClientInitialState = function( client )
	{
	 client.send( this.initialStateMessageObject() ) ;
	
	 console.log( 'sendClientInitialState' ) ;
	} ;


DomainServer.prototype.initialStateMessageObject = function()
	{
	 var domainInitialState = 
		{
		 type: "initialize",
		
		 elements: []  
		} ;

	 var nextElement ;

	 for( var i in this.elementSet )
		{
		 nextElement = this.elementSet[ i ] ;

		 domainInitialState.elements.push( nextElement.encodeToObject() ) ;
		}
		

	 return domainInitialState ;
	} ;

DomainServer.prototype.updateStateMessageObject = function()
	{
	 var domainUpdate = { type: "DomainUpdate", elements: [] } ;

	 var nextElement ;

	 for( var i in this.elementSet )
		{
		 nextElement = this.elementSet[ i ] ;

		 if( nextElement.changedSinceLastBroadcast )
			{
			 domainUpdate.elements.push( nextElement.encodeToObject() ) ;
			 nextElement.changedSinceLastBroadcast = false ;
			}
		}

	 return domainUpdate ;
	} ;


DomainServer.prototype.broadcast = function( message )
	{
	 console.log( 'BROADCAST BROADCAST BROADCAST ' + this.domainClientSet.length + ' ' + this.added) ;
		
	 for( var i in this.domainClientSet )
		{
		 console.log( 'sending to client: ' + i ) ;
		 this.domainClientSet[ i ].send( message ) ;			
		}
		
		
	} ;
	

DomainServer.prototype.broadcastUpdate = function()
	{
	 var updatedState = this.updateStateMessageObject() ;
		
	 for( var i in this.domainClientSet )
		{
		 this.domainClientSet[ i ].send( updatedState ) ;
		}
	} ;



DomainServer.prototype.receive = function( data, newMessage )
	{	
//	 var receiver ;
//	 var nextObj ;


	 console.log( 'DOMAIN SERVER RECEIVING MESSAGE ' + data + ' obj: ' + newMessage ) ;




	 if( newMessage.type == "call" )
		{
		 console.log( "CALL: " + JSON.stringify( newMessage ) ) ;
		 this.elementSet[ newMessage.id ].execute( newMessage ) ;
		}


	/*
	 if( newMessage.type == "DomainUpdate" )
		{

		}

	*/
	} ;


DomainServer.prototype.start = function( sendRate )
	{
	 var self = this ;
	
	 this.server.start() ;
	
	 this.updateProcess = setInterval( function() { self.broadcastUpdate() ;}, 1000 / sendRate ) ;
	} ;
	

DomainServer.prototype.stop = function()
	{
	 clearInterval( this.updateProcess ) ;	
	} ;


DomainServer.prototype._getNextId = function()
	{
	 if( this.recyclableIdCount > 0 )
		{
		 var nextId ;
		
		 for( var i in this.recyclableIdSet )
			{
			 nextId = i ;
			
			 delete this.recyclableIdSet[ i ] ;
			
			 return nextId ;
			}
		}
		
	 this.highestId++ ;
	
	 return this.highestId ;
	} ;


DomainServer.prototype._removeId = function( id )
	{
	 this.recyclableId[ id ] = id ;	
	} ;


DomainServer.prototype.addElement = function( object )
	{
	 var element = ( new DomainElement() ).init( this._getNextId(), object, this ) ;
		
	 this.elementSet[ element.id ] = element ;
	
	 return element ;
	} ;


DomainServer.prototype.removeElement = function( element )
	{
	 this._removeId( element.id ) ;
		
	 delete this.elementSet[ element.id ] ;	
	} ;



DomainClient.prototype.init = function( serverConnection )
	{
	 this.idToElement = {} ;
	
	 this.initFunctionSet = {} ;
	
	 this.factoryByPrototype = {} ;
	
	 // var serverConnection = ( new serverConnection.ServerConnection() ).init( port, host ) ;
	
	 this.serverConnection = serverConnection ;
	 
	 console.log( 'ex.after( this.serverConnection, "receive", this, "receive" ) ;') ;
	 ex.after( this.serverConnection, "receive", this, "receive" ) ;
	
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
	 var object = this.factoryByPrototype[ elementObj.prototypeName ]() ;
	
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
		 		
//		 receiverSet.push( this.construct( elements[ i ] ) ) ;
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
	
/*	
DomainClient.prototype.createNewObject = function( newObj )
	{
	 var initFunction = this.initFunctionSet[ newObj.prototypeName ] ;
	
	 var receiver = initFunction() ;
	
	 this.idToElement[ receiver.id ] = receiver ;
	
	  
	} ;
*/

function ObjectWebService() {} 


ObjectWebService.prototype.init = function( id, object, connection )
	{
	 var self 		= this ;
	
	 this.id 		= id ;
	
	 this.object 	= object ;	
	
	 this.connection = connection ;
	
	 this.prototypeName = object.constructor.name ;
	
	 return this ;	 
	} ;


ObjectWebService.prototype.encodeArguments = function( args )
	{
	 var returnArgs = [] ;

	 for( var i in args )
		{
		 returnArgs[ i ] = this.encodeArgument( args[ i ] ) ;
		}

	 return returnArgs ;
	} ;



ObjectWebService.prototype.encodeArgument = function( arg )
	{
	 if( ! ( arg instanceof Object ) )
		{
		 return arg ;
		}

	 if( arg instanceof Array )
		{
		 var array = arg ;

		 var encodedArray = new Array( array.length ) ;

		 for( var j = 0 ; j < array.length ; j++ )
			encodedArray[ j ] = this.encodeArgument( array[ i ] ) ;

		 return encodedArray ;
		}

	// thus arg instanceof Object )

	  if( arg.DomainElement )
		{
		 return { id: args[ i ].DomainElement.id } ;			
		}
	  else
		{
		 // we have a problem
		}


	};


ObjectWebService.prototype.broadcastFunction = function( member )
	{
	 var self = this ;

	 this.functions[ member ] = (function() { var fn = member ; return function()
			{
			 // if( self.server.DomainElement && self.server.DomainElement.isInCallTree  ) return ;

			 if( !self.connection.DomainElement ) self.connection.DomainElement = {} ;

			 // self.server.DomainElement.isInCallTree = true ;

			 var message = self.callMessageObject( member, arguments ) ;
		/*		{
				 type: 			"call", 
				 id: 			self.id, 
			 	 member: 		member,			 
				 argumentSet: 	self.encodeArguments( arguments )
				} ;*/

			 // console.log( "call: " + JSON.stringify( self.encodeArguments( arguments  ) ) ) ;
			 console.log( "args: " + JSON.stringify( message ) ) ;
			 console.log( "server = " + self.connection ) ;
			 self.connection.broadcast( message ) ;
			} ; } ) () ;

		//	 this.functions.clear = function() { /* self.server.DomainElement.isInCallTree = false ; */ } ;
		//	 console.log( this.functions.clear ) ;
		//	 ex.after( object, f, { bla: function() { console.log( 'nla') ; } }, 'bla' ) ;	

			 ex.before( this.object, member, this.functions, member ) ;	
	} ;


ObjectWebService.prototype.callMessageObject = function( member, args )
	{
	 return 		{
		 type: 			"call", 
		 id: 			this.id, 
	 	 member: 		member,			 
		 argumentSet: 	this.encodeArguments( args )
		} ;	
	} ;


ObjectWebService.prototype.decodeArgument = function( arg )
	{
	 if( ! (arg instanceof Object ) ) return arg ;

	 if( arg instanceof Array )
		{
		 var decodedArray = new Array( arg.length ) ;

		 for( var i in arg )
			{
			 decodedArray[ i ] = this.decodeArgument( arg[ i ] ) ;
			}

		 return decodedArray ;
		} 

	 return this.domainClient.idToElement[ arg.id ].object ;
	} ;



ObjectWebService.prototype.execute = function( callMessage )
	{
		
	 console.log( callMessage.member + JSON.stringify( args ) ) ;
		
	 var member = callMessage.member ;
	 var args	= this.decodeArgument( callMessage.argumentSet ) ;
	
	
	 console.log( 'MEMBER ' + member + ' ARGS ' + args ) ;
	
	 this.object[ member ].apply( this.object, args ) ;
	} ;



ObjectWebService.prototype.executeRemote = function( member, args )
	{
	 this.connection.send( this.callMessageObject( member, args ) ) ;
	} ;


DomainElement.prototype = new ObjectWebService() ;


DomainElement.prototype.init = function( id, object, domainServer )
	{
	 var self = this ;
	
	 ObjectWebService.prototype.init.apply( this, arguments ) ;
	 
	/*	
	 this.id = id ;
	
	 this.object = object ;
	
	 this.prototypeName = object.constructor.name ;
	
	*/
	
	 object.DomainElement = this ;
	
	 this.changedSinceLastBroadcast = true ;
	
	//  this.server = domainServer ;
	
	 this.functions = {} ;
	
	 /*
	 var func ;
	 for( var f in object )
		{
		 func = object[ f ] ;
		
		 if( func instanceof Function )
			{
			 this.functions[ f ] = (function() { var fn = f ; return function()
					{
					 if( self.server.DomainElement && self.server.DomainElement.isInCallTree ) return ;
						
					 if( !self.server.DomainElement ) self.server.DomainElement = {} ;
					
					 self.server.DomainElement.isInCallTree = true ;
						
					 var message = 
						{
						 type: 			"call", 
						 id: 			self.id, 
					 	 member: 		fn,			 
						 argumentSet: 	self.encodeArguments( arguments )
						} ;

					 // console.log( "call: " + JSON.stringify( self.encodeArguments( arguments  ) ) ) ;
					 console.log( "args: " + JSON.stringify( message ) ) ;
					 console.log( "server = " + self.server ) ;
					 self.server.broadcast( message ) ;
					} ; } ) () ;
			
		//	 ex.after( object, f, { bla: function() { console.log( 'nla') ; } }, 'bla' ) ;	
				
			 ex.before( object, f, this.functions, f ) ;
			} 
			
		}
	
	 */
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
	
	 var encoded = {id: this.id, prototypeName: this.prototypeName, object: obj } ;
	
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
	
	 var obj = this.object ;
	
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






exports.DomainServer  		  = DomainServer  		  ;
exports.DomainClient  		  = DomainClient  		  ;
exports.DomainElement 		  = DomainElement 		  ;
exports.DomainElementShadow	  = DomainElementShadow   ;
