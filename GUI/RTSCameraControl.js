
var mod = function()
{
	
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
	 var screenDirectionInWorld = this.tiltNode.convertLocal3NToWorldV( x, y, 0 ) ;
	
	 var screenDirectionInMoveNode = this.moveNode.convertWorld3NToLocalV.apply( this.moveNode, screenDirectionInWorld ) ;
	
	 this.moveNode.moveL3N( screenDirectionInMoveNode[ 0 ], screenDirectionInMoveNode[ 1 ], 0 ) ;
	}
	
		
	
RTSCameraControl.prototype.mouseMoved = function( evt )
	{
//	 console.log( evt.toString() ) ;
//	 console.log( 'mouse ( ' + evt.x + ', ' + evt.y + ' ) ' ) ;
	
		
	 if( evt.place[ 0 ] < 20 && this.processes.moveX == null ) 
		{
		 // console.log( 'left edge' ) ;
		 // this.processes.moveX = setInterval( function() { this.moveByScreenDirection( -10, 0 ) ; }, ogre.frame
		 // this.camera.before( 'renderOneFrame', ) ;
		}
	 else
		{
		 // this.processes.moveX = this.moveByScreenDirection( -10, 0 ) ;
		
		}
		
		
//	 console.log( 'window ' + ogre.window.width + ' ' + ogre.window.height ) ;
//	 console.log( 'xy ' + evt.x + ' ' + evt.y ) ;
		
	 if( evt.place[ 1 ] == 0 && evt.speed[ 1 ] < 0 ) 
		{
	//	 console.log( 'top edge ' + evt.dY ) ;
		 
		 this.moveByScreenDirection( 0, -evt.speed[ 1 ] ) ;
		}
		
	 if( evt.place[ 1 ] >= ogre.window.height - 1 && evt.speed[1] > 0 ) 
		{
	//	 console.log( 'top edge ' + evt.dY ) ;

		 this.moveByScreenDirection( 0, -evt.speed[ 1 ] ) ;
		}
		
		
		
	 if( evt.place[ 0 ] == 0 && evt.speed[ 0 ] < 0 ) 
		{
	//	 console.log( 'left edge ' + evt.dX ) ;

		 this.moveByScreenDirection( -evt.speed[ 0 ], 0 ) ;
		}

	 if( evt.place[ 0 ] >= ogre.window.width - 1 && evt.speed[ 0 ] > 0 ) 
		{
	//	 console.log( 'left edge ' + evt.dX ) ;

		 this.moveByScreenDirection( -evt.speed[ 0 ], 0 ) ;
		}
		
	} ;

return RTSCameraControl ;
} ;

	
define( [], mod ) ;