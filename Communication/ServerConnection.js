

var mod = function( net, Connection )
{
	
function ServerConnection() {} 

ServerConnection.prototype = new Connection() ;


ServerConnection.prototype.FRAME_LENGTH = 1 ;
ServerConnection.prototype.FRAME	 	= 2 ;

ServerConnection.prototype.init = function( port, host)
	{
	 var self = this ;
	
	 Connection.prototype.init.call( this, net.createConnection( port, host ) ) ;
	/*
	 this.connection = net.createConnection( port, host ) ;
	
	 this.connection.on( 'connect', function() { self.connect() ; } ) ;
	
	 this.connection.on( 'data', function( data ) { console.log( 'DATA RECEIVED' ) ; self.process( data ) ; } ) ;
	
	 this.connection.on( 'end', function() { self.end() ; } ) ;
	
	
	
	 this.currentTokenType 	= this.FRAME_LENGTH ; 
	
	 this.incompleteFrame	= "" ;
	 this.unreadLengthBytes =  4 ;
	 this.unreadFrameLength =  0 ;
	*/
	
	 return this ;
	} ;

return ServerConnection ;
} ;

define( ['net', './Connection' ], mod ) ;
