define(function (require, exports, module) {
// makes use of raphael.js

function Map()
{
 this.tileTable    ;
    
 this.tileColumnCount  ;
 this.tileRowCount     ;
  
 this.tileWidthPixels ;
 this.tileHeightPixels ;
 
 this.boundX ;
 this.boundY ;
    
 this.createTileTable ; //      ( tileColumnCount, tileRowCount ) 
  
 this.setTileDimensions ; //    ( tileWidthPixels, tileHeightPixels )
     
 this.tileAtPoint ; //          ( xWorld, yWorld )

 this.loadTiles ; //            ( tileFactory )
    
 this.trackUnit ; //            ( unit ) ;
}

Map.prototype.createTileTable = function( tileColumnCount, tileRowCount )
     {
      this.tileColumnCount  = tileColumnCount  ;
      this.tileRowCount = tileRowCount ;
         
      this.tileTable = new Array( tileColumnCount ) ;
         
      for( var i = 0  ; i < this.tileColumnCount ; i++ )
           this.tileTable[ i ] = new Array( tileRowCount ) ;
        
 
      this.boundX = this.tileWidthPixels * this.tileColumnCount ;
      this.boundY = this.tileHeightPixels * this.tileRowCount ;
     } ;



Map.prototype.setTileDimensions = function( tileWidthPixels, tileHeightPixels )
     {
      this.tileWidthPixels = tileWidthPixels ;
      this.tileHeightPixels = tileHeightPixels ;  
      
      this.boundX = this.tileWidthPixels * this.tileColumnCount ;
      this.boundY = this.tileHeightPixels * this.tileRowCount ;
     }


Map.prototype.tileAtPoint = function( xWorld, yWorld )
     {
      var xTile = Math.round( xWorld / this.tileWidthPixels  ) ;
      var yTile = Math.round( yWorld / this.tileHeightPixels ) ;
      
          
      return this.tileTable[ xTile ][ yTile ] ;
     } ;



Map.prototype.loadTiles = function( tileFactory )
	{
	 for( xTile = 0 ; xTile < this.tileColumnCount ; xTile ++ )
	 for( yTile = 0 ; yTile < this.tileRowCount    ; yTile ++ )
		this.tileTable[ xTile ][ yTile ] = tileFactory.create( xTile, yTile, this ) ;
	} ;


Map.prototype.trackUnit  = function( unit )
    {
     var self = this ;
     
     
     
     self.tileAtPoint( unit.x, unit.y ).add( unit ) ;
     
     unit.before( 'move', function() { self.tileAtPoint( unit.x, unit.y ).remove( unit ) ; } ) ;
     unit.before( 'move', function( x, y ) { if( x > self.boundX || y > self.boundY || x < 0 || y < 0 ) throw new ReturnImmediately( null ) ; } ) ;

     unit.after( 'move', function() { self.tileAtPoint( unit.x, unit.y ).add( unit ) ; } ) ;
    } ;


function EmptyTileFactory()
{
 this.create ; // ( xTile, yTile, map )
}

EmptyTileFactory.prototype.create = function( xTile, yTile, map ) { return new Tile( xTile, yTile, map ) ; } ;

exports.Map = Map ;

exports.EmptyTileFactory = EmptyTileFactory ;

} ) ;