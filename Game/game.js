


var mod = function( extend, DomainServer, Player, Map, Tile, Unit, Agent )
{
var after  = extend.after  ;
var before = extend.before ;



function Game() {}


Game.prototype.init = function( mapFactory, server )
	{
	 this.playerSet = [] ;

	 var domain = ( new DomainServer() ).init( server ) ;

	 domain.addConstructorFunction( 'Map',   Map   ) ;	
	 domain.addConstructorFunction( 'Tile',  Tile  ) ;
	 domain.addConstructorFunction( 'Unit',  Unit  ) ;
	 domain.addConstructorFunction( 'Agent', Agent ) ;

	 this.domain = domain ; 

	 this.map = new Map() ; 
	
	 before( this.map, "addUnit", 
		{
		 addElement: function( unit ) 
			{			
			 console.log( 'ADD UNIT' ) ; 
			 var agent = ( new Agent() ).init( unit ) ; 
			
	 		 var element = domain.addElement( unit ) ;
	
			 element.broadcastFunction( 'move' ) ;  

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


/*
Game.Prototype.Sendstateupdate  = function()
	{

	} ;
*/

Game.prototype.start = function()
	{

	} ;


return Game ;
} ;


define( [ 'extend', '../Communication/DomainServer.js', './Player.js', './Map.js', './Tile.js', './Unit.js', '../AI/Agent.js' ], mod ) ;








