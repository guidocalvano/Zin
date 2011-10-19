

var mod = function( Connection )
{
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

return ClientConnection ;
} ;


define( [ './Connection.js' ], mod ) ;