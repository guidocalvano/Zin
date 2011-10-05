
var ai = require( '../AI/agent.js' ) ;

var ex = require( 'extend' ) ;

var communication = require( '../Communication/communication.js' ) ;


var RTSCameraControlJS  = require( '../GUI/RTSCameraControl.js' ) ;

var SelectionControlJS  = require( '../GUI/SelectionControl.js' ) ;

var fs = require( 'fs' ) ;


function Map()
	{}
	
	
	
Map.prototype.init = function( mapFactory ) 
	{
		
	 this.createTileTable( mapFactory.tileColumnCount, mapFactory.tileRowCount ) ;
	 this.loadTiles( mapFactory  )
	
	 return this ;
	} ;
	

Map.prototype.createTileTable = function( tileColumnCount, tileRowCount )
	{
	 console.log( 'tt ' + tileColumnCount + ' - ' + tileRowCount ) ;
		
	 this.tileColumnCount  = tileColumnCount  ;
     this.tileRowCount = tileRowCount ;
       
     this.tileTable = new Array( tileColumnCount ) ;
       
     for( var i = 0  ; i < this.tileColumnCount ; i++ )
         this.tileTable[ i ] = new Array( tileRowCount ) ;
     

     this.boundX = Tile.prototype.WIDTH_UNITS  * this.tileColumnCount ;
     this.boundY = Tile.prototype.HEIGHT_UNITS * this.tileRowCount ;

	 console.log( 'TILETABLE CREATED') ;
	} ;

Map.prototype.xMapWorldToXTile = function( xMapWorld ) { return Math.floor( xMapWorld / Tile.prototype.WIDTH_UNITS ) ; } ;
Map.prototype.yMapWorldToYTile = function( yMapWorld ) { return Math.floor( yMapWorld / Tile.prototype.HEIGHT_UNITS ) ; } ;

Map.prototype.tileAtPoint = function( xMapWorld, yMapWorld )
     {
	  console.log( '-> TILE AT POINT xy ' + xMapWorld + ' ' + yMapWorld ) ;
	
	
      var xTile = this.xMapWorldToXTile( xMapWorld ) ;
      var yTile = this.yMapWorldToYTile( yMapWorld ) ;

	  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
	  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;	  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
		  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
			  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
				  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
					  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
					
					
//	  if( ! this.tileTable[ xTile ] && xTile != 0 ) process.exit( 0 ) ;
					
      return this.tileTable[ xTile ][ yTile ] ;
     } ;


Map.prototype.loadTiles = function( tileFactory )
	{
		 console.log( "xy " + this.tileColumnCount + ' ' + this.tileRowCount ) ;
	
		
	 for( var xTile = 0 ; xTile < this.tileColumnCount ; xTile ++ )
	 for( var yTile = 0 ; yTile < this.tileRowCount    ; yTile ++ )
		{
		 console.log( "xy " + xTile + ' ' + yTile ) ;
		 this.putTile( tileFactory.create( xTile, yTile  ) ) ;
		}
	} ;
	
	
Map.prototype.putTile = function( tile )
	{
	 console.log( 'puttile' ) ;
	 this.tileTable[ tile.xTile ][ tile.yTile ] = tile ;	
	} ;


Map.prototype.addUnit = function( unit )
	{
	 return this.trackUnit( unit ) ;	
	} ;
	


Map.prototype.trackUnit = function( unit )
    {
     var self = this ;


	
     var tile = self.tileAtPoint( unit.x, unit.y ) ;

	// if( tile.contains( unit ) ) process.exit(0) ;

	 // if( unit.tile )
	 //	unit.tile.remove( unit ) ;

	 if( ! tile.contains( unit ) )
	 	tile.add( unit ) ;

	 unit.Map = {} ; unit.Map.Track = 
		{
		 assureCoordinateOnMap: function( x, y ) { if( x > self.boundX || y > self.boundY || x < 0 || y < 0 ) {  throw ( new ex.ReturnImmediately( null ) ) ; } },
		 removeFromOldTile: 	function() { self.tileAtPoint( unit.x, unit.y ).remove( unit ) ; unit.tile = null ; },
		 addToNewTile:  		function() { var nextTile = self.tileAtPoint( unit.x, unit.y ) ; nextTile.add( unit ) ; unit.tile = nextTile ; }
		} ;
     ex.after(  unit, 'move', unit.Map.Track, 'addToNewTile' ) ;

     ex.before( unit, 'move', unit.Map.Track, 'removeFromOldTile' ) ;
     ex.before( unit, 'move', unit.Map.Track, 'assureCoordinateOnMap' ) ;

	 return tile ;
    } ;




Map.prototype.applyToTiles = function( start, end, funcOnTile )
	{
	 var returnArray = [] ;
		
	 var dX = -1 ;
	 var dY = -1 ;
	
	 if( start.x < end.x ) dX = 1 ;
	 if( start.y < end.y ) dY = 1 ;

	 console.log( "mws.x " + start.x + " mwe.x " + end.x + " mws.y " + start.y + " mwe.y " + end.y ) ;
	
     var xTileStart = this.xMapWorldToXTile( start.x ) ;
     var yTileStart = this.yMapWorldToYTile( start.y ) ;
     var xTileEnd   = this.xMapWorldToXTile( end.x   ) ;
     var yTileEnd   = this.yMapWorldToYTile( end.y   ) ;

	 var nextReturn ; 
	
	 console.log( "xs " + xTileStart + " xe " + xTileEnd + " ys " + yTileStart + " ye " + yTileEnd ) ;
	
	
	 for( var x = xTileStart ; x != xTileEnd + dX ; x += dX )
	 for( var y = yTileStart ; y != yTileEnd + dY ; y += dY )
		{
		 console.log( 'xy ' + x + ' ' + y ) ;
			
		 nextReturn = funcOnTile( this.tileTable[ x ][ y ] );	
		
		 if( nextReturn ) returnArray.push( nextReturn ) ;
		}
		
	 return returnArray ;
	} ;

Map.prototype.getUnits = function( start, end )
	{ 
	 console.log( 'Map.prototype.getUnits' ) ;
		
	 return this.applyToTiles( start, end, function( tile ) 
			{
			 var un = tile.collect( function( unit ) { if( unit instanceof Unit ) { console.log( "unit found") ; return unit ; } ; console.log( "not a unit") ;} ) ;
			
			 if( un.length > 0 ) { console.log( "returning unit" ) ; return un[ 0 ] ; }
			}  ) ; 
	} ;


Map.prototype.initAfterLoad = function()
	{
	 this.initAddAllUnitsOnMap() ;
	} ;
	
	
Map.prototype.initAddAllUnitsOnMap = function()
	{
	 var unitSet = this.getUnits( { x: 0, y: 0 }, { x: this.boundX - 1, y: this.boundY - 1 } ) ;
	
	 for( var i in unitSet )
		this.addUnit( unitSet[ i ] ) ;
	} ;


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

function UnitControl() {} 

UnitControl.prototype.init = function( unit, parent )
	{
	 this.unit = unit ;
	
	 this.node = ( new ogre.SceneNode() ).init() ;
	
	 this.node.setParent( parent ) ;
	
//	 this.node.moveL3N( unit.x, unit.y, 0 ) ;
	
	 this.entity = ( new ogre.Entity() ).init( 'unitMeshCombined.mesh' ) ;	
	
	 this.entity.setParent( this.node ) ;
	
	 this.entity.Control = this ;
	
	 this.unit.Control = this ;
	
	 // this.selected = new ogre.Entity( 'unitMeshCombinedSelect.mesh' ) ;
	
	 // this.selected.setParent( this.node ) ;
	
	 this.move( unit.x, unit.y ) ;
	
	 ex.after( unit, "move", this, "move" ) ;
	
	 return this ;
	}


UnitControl.prototype.mousePressedOnControl = function( event, control )
	{
	 if( control.constructor.name == 'TileControl' ) 
		{
		 this.unit.Agent.DomainElementShadow.executeRemote( 'moveTo', [ control.tile.xTile * Tile.prototype.WIDTH_UNITS, control.tile.yTile * Tile.prototype.HEIGHT_UNITS ] ) ;
		} ;
	
		
	} ;

	
UnitControl.prototype.move = function( newX, newY )
	{
	
	 var o = this.node.convertLocalOXYZToParentOXYZ( { x: 0, y: 0, z: 0 } )  ;	

	 var heading = this.node.convertParentOXYZToLocalOXYZ( { x: newX, y: newY, z: 0 } ) ;
	
		
	 var newPosParentOXYZ = { x: newX, y: newY, z: 0  } ;
	
	 var newPosLocalOXYZ  = this.node.convertParentOXYZToLocalOXYZ( newPosParentOXYZ ) ;
	
	 this.node.moveL3N( newPosLocalOXYZ.x, newPosLocalOXYZ.y, 0 ) ;	


	 if( heading.x == 0 && heading.y == 0 ) return ;
	
	 var controlYaw = Math.atan2( -heading.x, heading.y ) ;
	

	
	 this.node.roll( controlYaw ) ; // because the z axis points upward rather than forward, and the y axis
												// points forward in its stead, roll must be called. Yaw is clearer 
												// about what is happening so it is used throughout the rest of the code.
	} ;





UnitControl.prototype.select = function()
	{
	 if( !this.selectEntity )
		{
	 	 this.selectEntity = ( new ogre.Entity() ).init( 'unitMeshCombinedSelect.mesh' ) ; 
	 	 this.selectEntity.Control = this ;
		}

	 this.selectEntity.setParent( this.node ) ;
	
	 console.log( "unit selected" ) ;
	} ;



UnitControl.prototype.unselect = function()
	{
	 this.selectEntity.setParent( null ) ;
	} ;



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


function Game() {}


Game.prototype.init = function( mapFactory, server )
	{
	 this.playerSet = [] ;

	 var domain = ( new communication.DomainServer() ).init( server ) ;

	 this.domain = domain ; 

	 this.map = new Map() ; 
	
	 ex.before( this.map, "addUnit", 
		{
		 addElement: function( unit ) 
			{
			 console.log( 'ADD UNIT' ) ; 
			 var agent = ( new ai.Agent() ).init( unit ) ; 
	 		 var element = domain.addElement( unit ) ; 
			 element.broadcastFunction( 'move' ) ;  
			 domain.addElement( agent ) ;  
			} 
		}, "addElement" ) ;
		
	 ex.after( this.map, "putTile", domain, "addElement" ) ;

	 this.map.init( mapFactory ) ;

	 this.domain.addElement( this.map ) ;
	
	 ex.after( this, "addPlayer", this.domain, "addClient" ) ;
	

	 return this ;
	} ;

Game.prototype.initCommunication = function()
	{
		
	} ;



Game.prototype.addPlayer = function( clientConnection )
	{
	 this.playerSet.push( (new Player() ).init( clientConnection) ) ;
	
	 console.log( 'addPlayer' ) ;
	} ;



Game.prototype.sendStateUpdate  = function()
	{

	} ;


Game.prototype.start = function()
	{

	} ;


function Player() {}

Player.prototype.init = function( game, clientConnection )
	{
	 this.client = clientConnection ;

	 this.game   = game ;

	 return this ;
	} ;



function TileControl(){} 

TileControl.prototype.init = function( tile, parentNode )
	{
	 this.tile = tile ;
	
	 tile.Control = this ;

	 this.node 		= ( new ogre.SceneNode() ).init() ;
	 this.entity	= ( new ogre.Entity() ).init( 'tile.mesh' ) ;

	 this.entity.setParent( this.node ) ;
	
	 this.entity.Control = this ;
	
	 this.node.setParent( parentNode ) ;

	 this.node.moveL3N( tile.xTile * Tile.prototype.WIDTH_UNITS, tile.yTile * Tile.prototype.HEIGHT_UNITS, 0 ) ;
	

//	 var self = this ;
//	 this.tile.after( 'add', function() { self.setTileColor() ; } ) ;
//	 this.tile.after( 'remove', function() { self.setTileColor() ; } ) ;

	 return this ;

	}


TileControl.prototype.highlight = function()
	{
	 if( !this.highlightEntity )
		{
	 	 this.highlightEntity = ( new ogre.Entity() ).init( 'tileSelect.mesh' ) ; 
	 	 this.highlightEntity.Control = this ;
		}
	
	 this.highlightEntity.setParent( this.node ) ;
	} ;



TileControl.prototype.unhighlight = function()
	{
	 this.highlightEntity.setParent( null ) ;
	} ;


function MapControl() {}

MapControl.prototype.init = function( map )
	{
	 console.log( 'MapControl.init' ) ;
	 this.map = map ;
	
	 map.Control = this ;
	
	 this.node = ( new ogre.SceneNode() ).init() ;
	
	 this.node.setParent( ogre.root ) ;
		
	 this.tileControlTable = new Array( this.map.tileTable.length ) ;

	 for( var tileColumn = 0 ; tileColumn < this.map.tileTable.length ; tileColumn++ )
		{
	     this.tileControlTable[ tileColumn ] = new Array( this.map.tileTable[ tileColumn ].length ) ;
		
		 for( tileRow = 0 ; tileRow < this.map.tileTable[ tileColumn ].length ; tileRow++  )
			{
			 console.log( ' tx ty ' + tileColumn + ' ' + tileRow + ' ' + this.map.tileTable[ tileColumn ][ tileRow ].constructor.name ) ;
	         this.tileControlTable[ tileColumn ][ tileRow ] = ( new TileControl() ).init( this.map.tileTable[ tileColumn ][ tileRow ], this.node ) ;	    	
			}
		 console.log( 'tile row created: ' + tileColumn ) ;
		}
	
		 console.log( 'TILECONTROLTABLE CREATED') ;
	
	 var unitSet = map.getUnits( { x: 0, y: 0 }, { x: map.boundX - 1, y: map.boundY - 1 } ) ;
	
	for( var i in unitSet )
		(new UnitControl()).init( unitSet[ i ], this.node ) ;
	
	 return this ;
	} ;


MapControl.prototype.convertWorldOXYZToMapWorldOXY = function( worldOXYZ )
	{
	 var localOXYZ = this.node.convertWorldOXYZToLocalOXYZ( worldOXYZ ) ;
	
	 var mapWorldOXY = { x: localOXYZ.x, y: localOXYZ.y } ;
	 // var mapWorldOXY = { x: localOXYZ.x, y: localOXYZ.y } ;
	
	 return mapWorldOXY ;
	} ;


MapControl.prototype.highlightTiles = function( start, end )
	{
	 this.map.applyToTiles( start, end, function( tile ) { tile.Control.highlight() ; } ) ;	
	} ;


MapControl.prototype.unhighlightTiles = function( start, end )
	{
	 this.map.applyToTiles( start, end, function( tile ) { tile.Control.unhighlight() ; } ) ;	
	} ;



function GameControl() {}

GameControl.prototype.init = function( serverConnection )
	{
	 var self = this ;
	
	
	 Map.prototype.whichSide = "Client" ;
		
	 this.domainClient = ( new communication.DomainClient() ).init( serverConnection ) ;
	
	 this.domainClient.factoryByPrototype[ 'Map'  ] = function() { return new Map() ; }  ;	
	 this.domainClient.factoryByPrototype[ 'Unit' ] = function() { return new Unit() ; }  ;	
	 this.domainClient.factoryByPrototype[ 'Tile' ] = function() { return new Tile() ; }  ;	
	 this.domainClient.factoryByPrototype[ 'Agent'  ] = function() { return new ai.Agent() ; }  ;	


/*
	 ex.after( this.domainClient.factoryByPrototype, 'Map',  { attachMapControl: function( map )  { ( new MapControl() ).init(  map  ) ; console.log( 'map created, control attached') ; } }, 'attachMapControl' ) ;
	 ex.after( this.domainClient.factoryByPrototype, 'Unit', { attachMapControl: function( unit ) { ( new UnitControl() ).init( unit ) ; } }, 'attachMapControl' ) ;
	 ex.after( this.domainClient.factoryByPrototype, 'Tile', { attachMapControl: function( tile ) { ( new TileControl() ).init( tile ) ; } }, 'attachMapControl' ) ;
*/

	
// 	 this.domainClient.addPrototype( Map.prototype, function( map )  { ( new MapControl() ).init(  map  ) ; console.log( 'map created, control attached') ; } ) ;

	 ex.after( this.domainClient, 'initializeElements', this, 'afterDomainInitialized' ) ;

 //	 this.domainClient.addPrototype( Unit.prototype, function( unit )  { ( new UnitControl() ).init(  unit  ) ; console.log( 'map created, control attached') ; } ) ;
 //	 this.domainClient.addPrototype( Tile.prototype, function( tile )  { ( new TileControl() ).init(  tile  ) ; console.log( 'map created, control attached') ; } ) ;
	

	 this.camera = ( new RTSCameraControlJS.RTSCameraControl() ).init( ogre.root, ogre.camera ) ;
	
	
	
	
	
	
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
		 console.log( objectSet[ i ].constructor.name ) ;
		 if( objectSet[ i ].constructor.prototype == Map.prototype )
			{
			 var map = objectSet[ i ] ;
			
			 // if( map.tileColumnCount != 10 || map.rowCount != 10 ) process.exit(0) ;
			
			 //if( ! map.tileTable[0] ) process.exit( 0 ) ;
			 map.initAfterLoad() ;
				
			 this.mapControl = ( new MapControl() ).init( map ) ;
			}
		}
		
		
	 this.selectionControl = ( new SelectionControlJS.SelectionControl() ).init( this.mapControl.map ) ;
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





exports.Game			= Game 			;
exports.GameControl		= GameControl 	;
exports.Map 			= Map 			;
exports.MapControl		= MapControl 	;
exports.Tile			= Tile 			;
exports.TileControl		= TileControl 	;
exports.Unit			= Unit			;
exports.UnitControl		= UnitControl	;

exports.EmptyTileFactory = EmptyTileFactory ;





