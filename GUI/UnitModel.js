

var mod = function( Unit )
    {
     function UnitModel() {} 
    
    
     UnitModel.prototype = new Unit() ;
    
     return UnitModel ;
    
    } ;
    
    
define( [ '../Game/Unit.js' ], mod ) ;