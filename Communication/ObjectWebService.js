var mod = function( extend )
{
var after  = extend.after  ;
var before = extend.before ;

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

			 before( this.object, member, this.functions, member ) ;	
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

return ObjectWebService ;
}

define( [ 'extend'], mod ) ;