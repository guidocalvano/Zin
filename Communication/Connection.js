

var mod = function()
{
	
function Connection() {}


Connection.prototype.FRAME_LENGTH 	= 1 ;
Connection.prototype.FRAME	 		= 2 ;
	
Connection.prototype.init = function( connection )
	{
	 var self = this ;

	 this.connection = connection ;

	 this.connection.on( 'connect', function() { self.connect() ; } ) ;

	 this.connection.on( 'data', function( data ) { console.log( 'DATA RECEIVED' ) ; self.process( data ) ; } ) ;

	 this.connection.on( 'end', function() { self.end() ; } ) ;
		
		
		
	 this.currentTokenType 	= this.FRAME_LENGTH ; 

	 this.incompleteFrame	= "" ;
	 this.unreadLengthBytes =  4 ;
	 this.unreadFrameLength =  0 ;

	 return this ;
	} ;
	

Connection.prototype.send = function( object )
	{
	 var data = JSON.stringify( object ) ;


	var encodedDataLength = this.encodeDataLength( data )

//	 var frame = encodedDataLength ;// + new Buffer( data ) ;


	 this.connection.write( encodedDataLength ) ;	

	 this.connection.write( data ) ;
	} ;



Connection.prototype.encodeDataLength = function( data )
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






Connection.prototype.process = function( data )
	{
	 var i = 0 ;

	 var str = data.toString() ;
	 var nextChar ;
	 var nextByte ;

	 var messagesCompletedThisCall = 0 ;
	

	 var toByte ;
	
	 if( data.constructor.name == 'String' )
		toByte = function( s, c ) { return s.charCodeAt( c ) ; } ;
	 else
		toByte = function( s, c ) { return s[ c ] ; } ;

	 while( i < str.length )
		{
	//	 console.log( 'at ' + i ) ;
		 nextChar = str[ i ] ;		
		 nextByte = toByte( data, i ) ;		

		 i++ ;

		 if( this.currentTokenType == this.FRAME_LENGTH )
			{
			 this.unreadFrameLength = this.unreadFrameLength * 256 + nextByte ; 
			 this.unreadLengthBytes-- ;


			 if( this.unreadLengthBytes == 0 )
				{
				 this.currentTokenType = this.FRAME ;				
				}


			}
		 else if( this.currentTokenType == this.FRAME )
			{


			 this.incompleteFrame += nextChar ;

			 this.unreadFrameLength-- ;

			 if( this.unreadFrameLength == 0 )
				{
				 this.currentTokenType  = this.FRAME_LENGTH ;
				 this.unreadLengthBytes = 4 ;

				 this.receive( this.incompleteFrame ) ;

				 this.incompleteFrame = "" ;

				}
			}

		}
		

	} ;



Connection.prototype.connect = function()
	{	
	} ;


Connection.prototype.receive = function( data )
	{

	 var obj = JSON.parse( data ) ;	

	 console.log( "Connection.receive " ) ;

	 return obj ;
	} ;


Connection.prototype.end = function()
	{	
	} ;

return Connection ;
} ;


define( [], mod ) ;