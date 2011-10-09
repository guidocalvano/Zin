

var mod = function()
{
function Player() {}

Player.prototype.init = function( game, clientConnection )
	{
	 this.client = clientConnection ;

	 this.game   = game ;

	 return this ;
	} ;

return Player ;
} ;



define( [], mod ) ;