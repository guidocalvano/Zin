
var RTSCameraControlJS  = require( './RTSCameraControl.js' ) ;

var SelectionControlJS  = require( './SelectionControl.js' ) ;

var communication		= require( '../communication/communication.js' ) ;

var game				= require( '../Game/game.js' ) ;

function GameControl() {}

GameControl.prototype.init = function()
	{
	 this.camera = ( new RTSCameraControlJS.RTSCameraControl() ).init( ogre.root, ogre.camera ) ;
	
	 this.defaultGUIEventBinding() ;
	
	 this.mapControl = ( new game.MapControl() 	).init( ( new game.Map() ).init( 50, 50 ) ) ;
	
	 this.selectionControl = ( new SelectionControlJS.SelectionControl() ).init( this.map ) ;
	
	 this.domainClient = ( new communication.DomainClient() ).init( 8124, 'localhost' ) ;
	
	
	 this.sky = new ogre.Entity( 'sky.mesh' ) ;
	 this.sky.setParent( ogre.root ) ;

	
	 return this ;
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

exports.GameControl = GameControl ;