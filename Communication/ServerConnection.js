
var net = require( 'net' ) ;

var Connection = require( './Connection.js')

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


/*

ServerConnection.prototype.process = function( data )
	{
	 console.log( 'PROCESS DATA: ' ) ;
	
	 var i = 0 ;

	 var str = data.toString() ;
	 var nextChar ;
	 var nextByte ;

	 var messagesCompletedThisCall = 0 ;
	 console.log( str ) ;

	 while( i < str.length )
		{
	//	 console.log( 'at ' + i ) ;
		 nextChar = str[ i ] ;		
		 nextByte = data[ i ] ;		
		
		 i++ ;

		 if( this.currentTokenType == this.FRAME_LENGTH )
			{
			 console.log( 'processing frame length data ' + i + ' ' + nextChar ) ;
			 console.log( 'digit = ' + nextByte ) ;	
				
			 this.unreadFrameLength = this.unreadFrameLength * 256 + nextByte ; 
			 this.unreadLengthBytes-- ;
			

			 if( this.unreadLengthBytes == 0 )
				{
				 this.currentTokenType = this.FRAME ;				
				}
			 

			}
		 else if( this.currentTokenType == this.FRAME )
			{
		//	 console.log( 'frame data ' + i + ' ' + nextChar + ' l = ' + this.unreadFrameLength ) ;
			
				
			 this.incompleteFrame += nextChar ;

			 this.unreadFrameLength-- ;

			 if( this.unreadFrameLength == 0 )
				{
				 console.log( 'FRAME COMPLETE ' + messagesCompletedThisCall ) ;
				 this.currentTokenType  = this.FRAME_LENGTH ;
				 this.unreadLengthBytes = 4 ;

				 this.receive( this.incompleteFrame ) ;

				 this.incompleteFrame = "" ;

				}
			}

		}
	} ;



ServerConnection.prototype.connect = function()
	{	
	} ;
	
	
ServerConnection.prototype.receive = function( data )
	{
	 console.log( 'RECEIVE') ;	
	
	 var obj = JSON.parse( data ) ;	
	
//	 console.log( "SC.rec: " + JSON.stringify( obj ) ) ;
	
	 return obj ;
	} ;
	
	
ServerConnection.prototype.end = function()
	{	
	} ;


ServerConnection.prototype.send = function( data )
	{
	 this.connection.write( data ) ;	
	} ;
	
*/
	
exports.ServerConnection = ServerConnection ;