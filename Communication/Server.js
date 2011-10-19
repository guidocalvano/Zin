
var mod = function( net, extend, ClientConnection )
{
var after  = extend.after  ;
var before = extend.before ;
	
	
function Server() {}


Server.prototype.init = function( port, host )
	{
	 var self = this ;
	
	 this.clientConnectionSet = {} ;
	
	 this.server = net.createServer( function( client ) 
			{
			 client.setEncoding('utf8');			
			 self.addClientConnection( client ) ;
			
			}
		) ;
		
	 this.port = port ;
	 this.host = host ;
		
	 return this ;
	} ;
	
Server.prototype.start = function()
	{
	 this.server.listen( this.port, this.host ) ;	
	} ;
	
Server.prototype.addClientConnection = function( client )
	{
	 var clientConnection = ( new ClientConnection() ).init( client ) ;
	
	 this.clientConnectionSet[ client ] = clientConnection ;
	
	 console.log( 'addClientconnection' ) ;
	
	 after( clientConnection, 'receive', this, 'receive' ) ;
	
	 return clientConnection ;
	} ;

var j = 0 ;	
	
Server.prototype.broadcast = function( data )
	{
	
	 var string = JSON.stringify( data ) ;
	
	 // console.log( 'message ' + string ) ;
	
	 for( var i in this.clientConnectionSet )
		{
		 this.clientConnectionSet[ i ].send( string ) ;		
		}
		
	} ;

Server.prototype.receive = function( data, object ) 
	{
	 console.log( 'SERVER.receive( data = ' + data + ', object = ' + JSON.stringify( object ) + ' ) ' ) ;
	} ;


return Server ;
} ;


define( [ 'net', 'extend', './ClientConnection.js' ], mod ) ;