
var mod = function( Tile )
{

function EmptyTileFactory()
	{
	}


EmptyTileFactory.prototype.init = function( colCount, rowCount )
	{
	 this.tileColumnCount = colCount ;
	 this.tileRowCount = rowCount ;
		
	 return this ;
	}

EmptyTileFactory.prototype.create = function( xTile, yTile ) 
	{ return (new Tile() ).init( xTile, yTile ) ; } ;

return EmptyTileFactory ;
} ;

define( ['./Tile.js' ], mod ) ;