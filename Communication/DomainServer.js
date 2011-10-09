

var mod = function( extend, DomainElement )
{
var after  = extend.after  ;
var before = extend.before ;


function DomainServer() {}

DomainServer.prototype.init = function( server )
	{
	 this.highestId = -1 ;
	
	 this.recyclableIdSet = {} ;
	 this.recyclableIdCount = 0 ;	
	
	 this.elementSet = {} ;
	
	 this.domainClientSet = [] ;
	
	 this.server = server ;
	
	 after( server, 'receive', this, 'receive' ) ;
			
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
	
return DomainServer ;
} ;

define( [ 'extend', './DomainElement'], mod ) ;