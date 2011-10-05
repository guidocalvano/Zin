
var game = require( './Game/game.js' ) ;

function GameServer {} 


GameServer.prototype.init = function()
	{
	 this.map = ( new game.Map() ).init( 100, 100 ) ;
	} ;


GameServer.prototype.addNewClient = function( client )
	{
	
	} ;
	
	
GameServer.prototype.broadcastGameState = function()
	{
	
	} ;