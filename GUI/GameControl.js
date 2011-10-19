
var mod = function( extend, DomainClient, RTSCameraControl, SelectionControl, MapControl, Map, Tile, Unit, Agent )
{
var after  = extend.after  ;
var before = extend.before ;

function GameControl() {}

GameControl.prototype.init = function( serverConnection )
	{
	 var self = this ;
	
	
	 Map.prototype.whichSide = "Client" ;
		
	 this.domainClient = ( new DomainClient() ).init( serverConnection ) ;
	
	 this.domainClient.addConstructorFunction( 'Map',   Map ) ;
	 this.domainClient.addConstructorFunction( 'Unit',  Unit ) ;
	 this.domainClient.addConstructorFunction( 'Tile',  Tile ) ;
	 this.domainClient.addConstructorFunction( 'Agent', Agent ) ;
	
	/*
	 this.domainClient.factoryByPrototype[ 'Map'  ] = function() { return new Map() ; }  ;	
	 this.domainClient.factoryByPrototype[ 'Unit' ] = function() { return new Unit() ; }  ;	
	 this.domainClient.factoryByPrototype[ 'Tile' ] = function() { return new Tile() ; }  ;	
	 this.domainClient.factoryByPrototype[ 'Agent'  ] = function() { return new Agent() ; }  ;	
	*/

	 after( this.domainClient, 'initializeElements', this, 'afterDomainInitialized' ) ;


	 this.camera = ( new RTSCameraControl() ).init( ogre.root, ogre.camera ) ;
	
	
	 this.sky = ( new ogre.Entity() ).init( 'sky.mesh' ) ;
	 this.sky.setParent( ogre.root ) ;

	
	 return this ;
	} ;


GameControl.prototype.afterDomainInitialized = function( _, objectSet )
	{
	 console.log( 'constructGui' ) ;
	
	 var mapCount = 0 ;
		
	 for( var i in objectSet )	
		{
		 // console.log( objectSet[ i ].constructor.name ) ;
		 if( objectSet[ i ].constructor.prototype == Map.prototype )
			{
			 var map = objectSet[ i ] ;
			
			 // if( map.tileColumnCount != 10 || map.rowCount != 10 ) process.exit(0) ;
			
			 //if( ! map.tileTable[0] ) process.exit( 0 ) ;
			 map.initAfterLoad() ;
				
			 this.mapControl = ( new MapControl() ).init( map ) ;
			}
		}
		
		
	 this.selectionControl = ( new SelectionControl() ).init( this.mapControl.map ) ;
	 this.defaultGUIEventBinding() ;
	
	} ;

	GameControl.prototype.defaultGUIEventBinding = function()
		{
		 var self = this ;

		 ogre.input.on( 'mouseMoved', 
			function( event ) { self.mouseMoved( event ) ; } ) ;

		 ogre.input.on( 'mousePressed', 
			function( event ) { self.mousePressed( event ) ; } ) ;

		 ogre.input.on( 'mouseReleased', 
			function( event ) { self.mouseReleased( event ) ; } ) ;
		} ;




	GameControl.prototype.mouseMoved = function( event )
		{
		 //console.log( 'GameControl.mouseMoved' ) ;
			
		 gui.input.injectMouseMoved( event ) ;

		 this.camera.mouseMoved( event ) ;

		 var hit = this.camera.pick( event.x, event.y ) ;

		 if( hit )
			{
			 event.hit = hit ;

		 	 this.selectionControl.mouseMovedOnEntity( event, hit.entity ) ;
			}
		}


	GameControl.prototype.mouseMovedOnEntity = function( event, entity )
		{
		} ;



	GameControl.prototype.mousePressed = function( event )	
		{
		 if( gui.input.injectMousePressed( event ) ) return ;

		 console.log( "gui mousepressed false" ) ;

		 var hit = this.camera.pick( event.x, event.y ) ;

		 // entity.emit( 'mousePressed', event ) ;

		 if( hit )
			{
			 event.hit = hit ;
		 	 this.selectionControl.mousePressedOnEntity( event, hit.entity ) ;
			}
		 else console.log( 'no enity');
		} ;


	GameControl.prototype.mousePressedOnEntity = function( event, entity )
		{ 	
		} ;


	GameControl.prototype.mouseReleased = function( event )	
		{
		 if( gui.input.injectMouseReleased( event ) ) return ;

		 var hit = this.camera.pick( event.x, event.y ) ;

		 // entity.emit( 'mouseReleased', event ) ;

		 if( hit )
			{
			 event.hit = hit ;
		 	 this.selectionControl.mouseReleasedOnEntity( event, hit.entity ) ;
			}
		} ;


	GameControl.prototype.mouseReleasedOnEntity = function( event, entity )
		{ 	
		} ;

return GameControl ;
} ;

define( [ 'extend', '../Communication/DomainClient.js', './RTSCameraControl.js', './SelectionControl.js', './MapControl.js', '../Game/Map.js', '../Game/Tile.js', '../Game/Unit.js', '../AI/Agent.js' ], mod ) ;