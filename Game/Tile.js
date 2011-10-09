
var mod = function()
{


function Tile() {}

Tile.prototype.WIDTH_UNITS  = 10 ;
Tile.prototype.HEIGHT_UNITS = 10 ;

Tile.prototype.init = function( xTile, yTile )
	{
	 this.xTile = xTile ;
	 this.yTile = yTile ;

	 this.isTraversable = true ;

	 this.content = new Array() ;

	 console.log( 'tile.init( ' + xTile + ', ' + yTile +' )' ) ;


	 return this ;
	} ;

Tile.prototype.add = function( newContent )
	{
	 this.content.push( newContent ) ;
	} ;

Tile.prototype.remove = function( oldContent )
	{
	 for( i = 0 ; i < this.content.length ; i++ )
		if( this.content[ i ] == oldContent )
			this.content.splice( i, 1 ) ;
	} ;


Tile.prototype.contains = function( obj )
	{
	 return this.content.indexOf( obj ) != -1 ;	
	} ;


Tile.prototype.collect = function( collectFunction )	
	{
	 var returnCollection = [] ;

	 var nextItem ;
	 var collectedItem ;
	 for( var i in this.content )
		{
		 nextItem = this.content[ i ] ;

		 collectedItem = collectFunction( nextItem ) ;

		 if( collectedItem )
		 	returnCollection.push( collectedItem ) ;
		}

	 return returnCollection ;
	} ;


return Tile ;


} ;



define( [],mod ) ;