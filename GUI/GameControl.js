
var mod = function( extend, DomainClient, EditorControl, RTSCameraControl, SelectionControl, MapControl, MapModel, Tile, Unit, Agent )
{
var after  = extend.after  ;
var before = extend.before ;

function GameControl() {}


GameControl.prototype.init = function( camera, domainClient )
	{
	 var self = this ;
	
     this.camera = camera ;
     this.domainClient = domainClient ;
    
	 after( this.domainClient, 'initializeElements', this, 'afterDomainInitialized' ) ;
	
	 return this ;
	} ;


GameControl.prototype.afterDomainInitialized = function( _, objectSet )
	{
     console.log( 'looking for MapModel' ) ;

    
	 for( var i in objectSet )	
		{
        
		 if( objectSet[ i ] instanceof MapModel )
			{
             console.log( 'MapModel found' ) ;
             
			 var map = objectSet[ i ] ;			

			 map.initAfterLoad() ;
			
			 this.mapControl = ( new MapControl() ).init( map ) ;
			}
		}
    
		
	 this.selectionControl = ( new SelectionControl() ).init( this.mapControl.map ) ;
		
	} ;

GameControl.prototype.mouseMovedOnEntity = function( event, entity )
	{
	 this.selectionControl.mouseMovedOnEntity( event, entity ) ;
	} ;
    
    
GameControl.prototype.mousePressedOnEntity = function( event, entity )
	{ 	
    
    
    
	 this.selectionControl.mousePressedOnEntity( event, entity ) ;	
	} ;


GameControl.prototype.mouseReleasedOnEntity = function( event, entity )
	{ 	
 	 this.selectionControl.mouseReleasedOnEntity( event, entity ) ;
	} ;

return GameControl ;
} ;

define( [ 'extend', '../Communication/DomainClient.js', './EditorControl.js', './RTSCameraControl.js', './SelectionControl.js', './MapControl.js', './MapModel.js', '../Game/Tile.js', '../Game/Unit.js', '../AI/Agent.js' ], mod ) ;