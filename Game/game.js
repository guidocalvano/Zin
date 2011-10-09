


var mod = function( extend, DomainServer, Player, Map, Agent )
{
var after  = extend.after  ;
var before = extend.before ;



function Game() {}


Game.prototype.init = function( mapFactory, server )
	{
	 this.playerSet = [] ;

	 var domain = ( new DomainServer() ).init( server ) ;

	 this.domain = domain ; 

	 this.map = new Map() ; 
	
	 before( this.map, "addUnit", 
		{
		 addElement: function( unit ) 
			{
			
			 console.log( 'ADD UNIT' ) ; 
			 var agent = ( new Agent() ).init( unit ) ; 
			
	 		 var element = domain.addElement( unit ) ;
	 		// process.exit( 0 ) ;
	
			 element.broadcastFunction( 'move' ) ;  
			 // process.exit( 0 ) ;
			
			// for( var i = 0 ; i < 100 ; i++ )
			//	console.log( Agent.prototype.constructor.name ) ;
				
			/*
			 if( agent.constructor.name == 'Agent' )
				{
				 console.log('bla agent' ) ; process.exit( 0 ) ;
				}*/
			 domain.addElement( agent ) ;  
			} 
		}, "addElement" ) ;
		
	 after( this.map, "putTile", domain, "addElement" ) ;

	 this.map.init( mapFactory ) ;

	 this.domain.addElement( this.map ) ;
	
	 after( this, "addPlayer", this.domain, "addClient" ) ;
	

	 return this ;
	} ;

Game.prototype.initCommunication = function()
	{
		
	} ;



Game.prototype.addPlayer = function( clientConnection )
	{
	 this.playerSet.push( (new Player() ).init( clientConnection) ) ;
	
	 console.log( 'addPlayer' ) ;
	} ;



Game.prototype.sendStateUpdate  = function()
	{

	} ;


Game.prototype.start = function()
	{

	} ;


return Game ;
} ;


define( [ 'extend', '../Communication/DomainServer.js', './Player.js', './Map.js', '../AI/Agent.js' ], mod ) ;








