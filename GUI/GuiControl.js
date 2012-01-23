


var mod = function( extend, DomainClient, RTSCameraControl, GameControl, EditorControl, Map, Tile, Unit, Agent )
{

function GuiControl() {}


GuiControl.prototype.init = function( serverConnection, withEditor )
        {
 	
         Map.prototype.whichSide = "Client" ;
		
         this.domainClient = ( new DomainClient() ).init( serverConnection ) ;
	
         this.domainClient.addConstructorFunction( 'Map',   Map ) ;
         this.domainClient.addConstructorFunction( 'Unit',  Unit ) ;
         this.domainClient.addConstructorFunction( 'Tile',  Tile ) ;
         this.domainClient.addConstructorFunction( 'Agent', Agent ) ;       
    
         this.camera = ( new RTSCameraControl() ).init( ogre.root, ogre.camera ) ;
	
	
         this.sky = ( new ogre.Entity() ).init( 'sky.mesh' ) ;
         this.sky.setParent( ogre.root ) ;
        
        
         this.gameControl = ( new GameControl() ).init( this.camera, this.domainClient, withEditor ) ;
        
        
         return this ;
        } ;
    
 return GuiControl ;
} ;

define( [ 'extend', '../Communication/DomainClient.js', './RTSCameraControl.js', './GameControl.js', './EditorControl.js', '../Game/Map.js', '../Game/Tile.js', '../Game/Unit.js', '../AI/Agent.js' ], mod ) ;


/*

function GuiControl() {}

GuiControl.GAME_MODE = 0 ;
GuiControl.EDIT_MODE = 1 ;

GuiControl.prototype.init = function( serverConnection, withEditor )
	{
	 this.domainClient = ( new DomainClient() ).init( serverConnection ) ;
		
		
	
	 this.camera = ( new RTSCameraControl() ).init( ogre.root, ogre.camera ) ;
	
	
	 this.withEditor = withEditor ;
	
	 this.currentMode = GuiControl.GAME_MODE ;
	
	
	 this.sky = ( new ogre.Entity() ).init( 'sky.mesh' ) ;
	 this.sky.setParent( ogre.root ) ;


	 this.gameControl 	= ( new GameControl() ).init( this.domainClient ) ;

	
	 if( this.withEditor )
	 	this.editorControl	= ( new EditorControl() ).init( serverConnection ) ;
	
	
	 return this ;
	} ;

GuiControl.prototype.afterDomainInitialized = function( _, objectSet )
	{
	
	 gameControl.afterDomainInitialized( _, objectSet )	;
	
	 if( this.withEditor )
		this.editorControl.afterDomainInitialized( _, objectSet ) ;
	}

GuiControl.prototype.bindGuiEvents = function()
	{
	 var self = this ;

	 ogre.input.on( 'mouseMoved', 
		function( event ) { self.mouseMoved( event ) ; } ) ;

	 ogre.input.on( 'mousePressed', 
		function( event ) { self.mousePressed( event ) ; } ) ;

	 ogre.input.on( 'mouseReleased', 
		function( event ) { self.mouseReleased( event ) ; } ) ;		
		
	 ogre.input.on( 'keyPressed', function( event ) { self.keyPressed( event ) ; }  ) ;
	} ;



GuiControl.prototype.keyPressed = function( event )	
	{
	 switch( event.keyChar )
		{
		 case ' ' :
		 	if( this.currentMode == GuiControl.GAME_MODE )
				this.currentMode = GuiControl.EDIT_MODE  ) ;
			else if( this.currentMode == GuiControl.EDIT_MODE )
				this.currentMode = GuiControl.GAME_MODE ;
			break ;
		 
		}
	} ;

	
GuiControl.prototype.mouseMoved = function( event )
	{
	 gui.input.injectMouseMoved( event ) ;

	 this.camera.mouseMoved( event ) ;

	 var hit = this.camera.pick( event.place[ 0 ], event.place[ 1 ] ) ;


	 if( hit )
		{
		 event.hit = hit ;

		 if( this.currentMode == GuiControl.GAME_MODE )
	 	 	this.gameControl.mouseMovedOnEntity( event, hit.entity ) ;
		}
	
		
	} ;


GuiControl.prototype.mousePressed = function( event )	
	{ 
	 if( gui.input.injectMousePressed( event ) ) return ;

	 var hit = this.camera.pick( event.place[ 0 ], event.place[ 1 ] ) ;
	 // entity.emit( 'mousePressed', event ) ;

	 if( hit )
		{
		 event.hit = hit ;

		 if( this.currentMode == GuiControl.GAME_MODE )
				 this.gameControl.mousePressedOnEntity( event, hit.entity ) ;
		}			
	} ;


GuiControl.prototype.mouseReleased = function( event )	
	{
	 if( gui.input.injectMouseReleased( event ) ) return ;

	 var hit = this.camera.pick( event.place[ 0 ], event.place[ 1 ] ) ;

	 // entity.emit( 'mouseReleased', event ) ;

	 if( hit )
		{
		 event.hit = hit ;
		
		 if( this.currentMode == GuiControl.GAME_MODE )
			 	 this.gameControl.mouseReleasedOnEntity( event, hit.entity ) ;
		}		
	} ;

*/