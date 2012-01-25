



var mod = function( Tile )
    {

     function TileModel() {}
     
     TileModel.prototype = new Tile() ;
     
     
     
     
     return TileModel ;
    } ;
    
    
define( [ '../Game/Tile.js' ], mod ) ;