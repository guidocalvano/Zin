


function RTSCameraControl() {}

RTSCameraControl.prototype.TILT_PITCH 	= 3.5 * 0.785398163 ;
RTSCameraControl.prototype.TILT_ROLL 	= 0.785398163 ;

RTSCameraControl.prototype.init = function( parentNode, camera )
	{
	 this.camera = camera ;
	
	 this.moveNode = ( new ogre.SceneNode() ).init() ;
	 this.tiltNode = ( new ogre.SceneNode() ).init() ;
	
	 this.moveNode.setParent( parentNode ) ;
	 this.tiltNode.setParent( this.moveNode ) ;
	 this.camera.setParent( this.tiltNode ) ;
	
	 this.moveNode.moveL3N( 0,0,100 ) ;

	 this.tiltNode.roll(   this.TILT_ROLL   ) ;	
	 this.tiltNode.pitch( this.TILT_PITCH ) ;
	
	 this.processes = { moveX: null, moveY: null } ;
	
	// this.defaultGUIEventBinding() ;
	
	 return this ;
	}


RTSCameraControl.prototype.pick = function( x, y ) { return this.camera.pick( x, y ) ; } ;


RTSCameraControl.prototype.moveByScreenDirection = function( x, y )
	{
	 var screenDirectionInWorld = this.tiltNode.convertLocalOXYZToWorldOXYZ( { x: x, y: y, z: 0 } ) ;
	
	 var screenDirectionInMoveNode = this.moveNode.convertWorldOXYZToLocalOXYZ( screenDirectionInWorld ) ;
	
	 this.moveNode.moveL3N( screenDirectionInMoveNode.x, screenDirectionInMoveNode.y, 0 ) ;
	}
	
		
	
RTSCameraControl.prototype.mouseMoved = function( evt )
	{
//	 console.log( evt.toString() ) ;
//	 console.log( 'mouse ( ' + evt.x + ', ' + evt.y + ' ) ' ) ;
	
		
	 if( evt.x<20 && this.processes.moveX == null ) 
		{
		 console.log( 'left edge' ) ;
		 // this.processes.moveX = setInterval( function() { this.moveByScreenDirection( -10, 0 ) ; }, ogre.frame
		 // this.camera.before( 'renderOneFrame', ) ;
		}
	 else
		{
		 // this.processes.moveX = this.moveByScreenDirection( -10, 0 ) ;
		
		}
		
		
//	 console.log( 'window ' + ogre.window.width + ' ' + ogre.window.height ) ;
//	 console.log( 'xy ' + evt.x + ' ' + evt.y ) ;
		
	 if( evt.y == 0 && evt.dY < 0 ) 
		{
		 console.log( 'top edge ' + evt.dY ) ;
		 
		 this.moveByScreenDirection( 0, -evt.dY ) ;
		}
		
	 if( evt.y >= ogre.window.height - 1 && evt.dY > 0 ) 
		{
		 console.log( 'top edge ' + evt.dY ) ;

		 this.moveByScreenDirection( 0, -evt.dY ) ;
		}
		
		
		
	 if( evt.x == 0 && evt.dX < 0 ) 
		{
		 console.log( 'left edge ' + evt.dX ) ;

		 this.moveByScreenDirection( -evt.dX, 0 ) ;
		}

	 if( evt.x >= ogre.window.width - 1 && evt.dX > 0 ) 
		{
		 console.log( 'left edge ' + evt.dX ) ;

		 this.moveByScreenDirection( -evt.dX, 0 ) ;
		}
		
	} ;



	
exports.RTSCameraControl = RTSCameraControl ;