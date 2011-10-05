

var net = require( 'net' ) ;

var ex = require( 'extend' ) ;

var Connection = require( './Connection.js' ) ;

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
	
	 ex.after( clientConnection, 'receive', this, 'receive' ) ;
	
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

	
function ClientConnection() {} 

ClientConnection.prototype = new Connection() ;

ClientConnection.prototype.init = function( client )
	{
	 Connection.prototype.init.call( this, client ) ;
	/*	
	 var self = this ;
		
	 this.client = client ;	
	
	 client.on( 'data', function( data ) { self.receive( data ) ; } ) ;
	 client.on( 'end', function() { self.end() ; } ) ;
	*/
	 return this ;
	} ;

/*
ClientConnection.prototype.send = function( object )
	{
	 var data = JSON.stringify( object ) ;
	
	 console.log( data.length ) ;
	 console.log( data ) ;
	 
	var encodedDataLength = this.encodeDataLength( data )
		
//	 var frame = encodedDataLength ;// + new Buffer( data ) ;
	
	 console.log( 'encodedDataLength[3] = ' + encodedDataLength[ 3 ] ) ;
		
	 this.client.write( encodedDataLength ) ;	
	 
	 this.client.write( data ) ;
	} ;
	
	
ClientConnection.prototype.encodeDataLength = function( data )
	{
	 var length = data.length ;
	
	 var buf = new Buffer( 4 ) ;


	 for( var i = 3 ; i >= 0 ; i-- )
		{
		
		 buf[ i ] = length % 256 ;
		 length = Math.floor( length / 256 ) ;
		
		 console.log( "b[ " + i + " ] = " + buf[ i ] ) ;
		}


	// buf.writeUInt32( 5, 0, 'big' ) ;
		
	 return buf ;
	} ;
	


ClientConnection.prototype.receive = function( data )
	{
	 console.log( 'RECEIVED ' + data ) ;
	
	 return JSON.parse( "" + data ) ;	
	} ;
	
ClientConnection.prototype.end = function()
	{} ;
	*/
	
exports.Server 		= Server 		;
