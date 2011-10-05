


function Game() {}


Game.prototype.init = function( map )
	{
	 this.playerSet = [] ;
	
	 this.domain = ( new DomainServer() ).init() ;
	
	 this.map = map ;
	 	
	 return this ;
	} ;
	
	
Game.prototype.addPlayer = function( clientConnection )
	{
	 this.playerSet.push( (new Player() ).init( clientConnection) ) ;
	} ;
	
	
Game.prototype.sendInitialState = function()
	{
		
	} ;
	
	
Game.prototype.sendStateUpdate  = function()
	{
		
	} ;

	
Game.prototype.startGame = function()
	{
		
	} ;
	
	
function Player() {}

Player.prototype.init = function( game, clientConnection )
	{
	 this.client = clientConnection ;
	
	 this.game   = game ;
	
	 return this ;
	} ;