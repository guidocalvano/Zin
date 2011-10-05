
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

	 console.log( data.length ) ;
	 console.log( data ) ;

	var encodedDataLength = this.encodeDataLength( data )

//	 var frame = encodedDataLength ;// + new Buffer( data ) ;

	 console.log( 'encodedDataLength[3] = ' + encodedDataLength[ 3 ] ) ;

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
	 console.log( 'PROCESS DATA: ' ) ;

	 var i = 0 ;

	 var str = data.toString() ;
	 var nextChar ;
	 var nextByte ;

	 var messagesCompletedThisCall = 0 ;
	 console.log( str ) ;
	
	 console.log( "unreadFrameLength " + this.unreadFrameLength ) ;

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
			 console.log( 'processing frame length data ' + i + ' ' + nextChar ) ;
			 console.log( 'digit = ' + nextByte ) ;	

			 this.unreadFrameLength = this.unreadFrameLength * 256 + nextByte ; 
			 this.unreadLengthBytes-- ;


			 if( this.unreadLengthBytes == 0 )
				{
				 console.log( "frame length " + this.unreadFrameLength ) ;
				 this.currentTokenType = this.FRAME ;				
				}


			}
		 else if( this.currentTokenType == this.FRAME )
			{
			 console.log( 'frame data ' + i + ' ' + nextChar + ' l = ' + this.unreadFrameLength ) ;


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
		
	 console.log( "data.constructor.name" +data.constructor.name   ) ;
		 console.log( "str.constructor.name" +str.constructor.name ) ;
	} ;



Connection.prototype.connect = function()
	{	
	} ;


Connection.prototype.receive = function( data )
	{
	 console.log( 'RECEIVE') ;	

	 var obj = JSON.parse( data ) ;	

	 console.log( "Connection.receive: " + JSON.stringify( obj ) ) ;

	 return obj ;
	} ;


Connection.prototype.end = function()
	{	
	} ;


module.exports = Connection ;