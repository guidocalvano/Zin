

var mod = function( Map )
    {

     function MapModel() { }
     
     MapModel.prototype = new Map() ;
     
     
     
     
     return MapModel ;
    } ;
    
    
define( [ '../Game/Map.js' ], mod ) ;