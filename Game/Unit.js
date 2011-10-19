
var mod = function()
{

function Unit() {}


Unit.prototype.init = function( x, y, side, map )
	{

	 this.x = x ;
	 this.y = y ;

	 this.yaw = 0 ;

	 this.map = map ;

	 this.side = side ;

	 return this ;
	} ;


Unit.prototype.move = function( newX, newY )
    {
     this.x = newX ;
     this.y = newY ;

	 this.yaw = Math.atan2( newY, newX ) ;
    } ;

return Unit ;
} ;



define( [],mod ) ;