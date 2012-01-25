


var mod = function( extend, DomainClient, RTSCameraControl, GameControl, EditorControl, MapModel, TileModel, UnitModel, AgentModel )
{

 var after  = extend.after  ;
 var before = extend.before ;

 function GuiControl() {}

 GuiControl.GAME_MODE = 0 ;
 GuiControl.EDIT_MODE = 1 ;


 GuiControl.prototype.init = function( serverConnection, withEditor )
        {
 	
         // MapModel.prototype.whichSide = "Client" ;
		
         this.domainClient = ( new DomainClient() ).init( serverConnection ) ;
	
       
    
         this.domainClient.addConstructorFunction( 'Map',   MapModel ) ;
         this.domainClient.addConstructorFunction( 'Tile',  TileModel ) ;
         this.domainClient.addConstructorFunction( 'Unit',  UnitModel ) ;
         this.domainClient.addConstructorFunction( 'Agent', AgentModel ) ;       
    
         this.camera = ( new RTSCameraControl() ).init( ogre.root, ogre.camera ) ;
	
	
         this.sky = ( new ogre.Entity() ).init( 'sky.mesh' ) ;
         this.sky.setParent( ogre.root ) ;
        
        
         
         this.currentMode = GuiControl.GAME_MODE ;
        
         this.gameControl = ( new GameControl() ).init( this.camera, this.domainClient ) ;
         
         this.withEditor = withEditor ;
         
         if( this.withEditor )
            {
             this.editorControl	= ( new EditorControl() ).init( this.domainClient, this.camera ) ;
            }        
        
        
         after( this.domainClient, 'initializeElements', this, 'afterDomainInitialized' ) ;

        
         return this ;
        } ;

 GuiControl.prototype.afterDomainInitialized = function( _, _)
    {
     this.initUIEventHandling() ;
    } ;


 GuiControl.prototype.initUIEventHandling = function()
    {
     var self = this ;
     


	 ogre.input.on( 'mouseMoved', 
		function( event ) { self.mouseMoved( event ) ; } ) ;

	 ogre.input.on( 'mousePressed', 
		function( event ) { self.mousePressed( event ) ; } ) ;

	 ogre.input.on( 'mouseReleased', 
		function( event ) { self.mouseReleased( event ) ; } ) ;
		
	 ogre.input.on( 'keyPressed', 
		function( event ) { self.keyPressed( event ) ; }  ) ;
    
    } ;
 



 GuiControl.prototype.keyPressed = function( event )	
	{
	
	 switch( event.keyChar )
		{
		 case ' ' :
		 	if( this.currentMode == GuiControl.GAME_MODE )
				this.currentMode = GuiControl.EDIT_MODE  ;
			else if( this.currentMode == GuiControl.EDIT_MODE )
				this.currentMode = GuiControl.GAME_MODE ;
			break ;

		}
		
	} ;


GuiControl.prototype.mouseMoved = function( event )
	{
	 console.log( 'GuiControl.mouseMoved' ) ;

		
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
     if( event.leftIsDown && ( ogre.input.keyIsPressed[ "leftControl" ] || ogre.input.keyIsPressed[ "rightControl" ] ) ) 
        {
         event.leftIsDown  = false ;
         event.rightIsDown = true  ; 
        }
    
    
	 if( gui.input.injectMousePressed( event ) ) return ;

	 console.log( "gui mousepressed false" ) ;

	 var hit = this.camera.pick( event.place[ 0 ], event.place[ 1 ] ) ;

	 // entity.emit( 'mousePressed', event ) ;

	 if( hit )
		{
		 event.hit = hit ;

		 console.log( 'processing mouse pressed' ) ;
		 if( this.currentMode == GuiControl.GAME_MODE )
			{
			 console.log( 'GAME_MODE' ) ;
	 	 	 this.gameControl.mousePressedOnEntity( event, hit.entity ) ;
			}
		 else if ( this.currentMode == GuiControl.EDIT_MODE )
      		{
      		 this.editorControl.mousePressed( event, hit.entity ) ;
      		}
		}
	 else console.log( 'no enity');
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



 return GuiControl ;
} ;

define( [ 'extend', '../Communication/DomainClient.js', './RTSCameraControl.js', './GameControl.js', './EditorControl.js', './MapModel.js', './TileModel.js', './UnitModel.js', './AgentModel.js' ], mod ) ;

