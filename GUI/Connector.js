
define( [ '../Math/vector.js' ], function( vector )
{
 // var vector = require( '../../OgreJS/js/vector.js' ) ; //.localize( this ) ;

 // vector.localize( this ) ;
 var create3N = vector.create3N ;
 var assign = vector.assign ;
 var inc = vector.inc ;
 var dec = vector.dec ;
 var plus = vector.plus ;
 var minus = vector.minus ;
 var dotProd = vector.dotProd ;
 var crossProd = vector.crossProd ;
 var length2 = vector.length2 ;
 var length = vector.length ;
 var normalize = vector.normalize ;
 var scaleUp = vector.scaleUp ;
 var scaleDown = vector.scaleDown ;
 var eq = vector.eq ;
 var neq = vector.neq ;

 function Connector() {} ;


 Connector.prototype.init = function( sceneNodeFrom, sceneNodeTo )
	{
	 this.sceneNodeA = sceneNodeTo ;
	 this.sceneNodeB = sceneNodeFrom ;
	
	 this.entity = ( new ogre.Entity() ).init( 'connector.mesh' ) ;
	
	 this.sceneNode = ( new ogre.SceneNode() ).init() ;
	
	 this.scaleNode = ( new ogre.SceneNode() ).init() ;
	
	 this.scaleNode.setParent( this.sceneNode ) ;
	
	 this.entity.setParent( this.scaleNode ) ;
	
	 this.sceneNode.setParent( ogre.root ) ;
	
 	 this.thickness = 5 ;
	
	 this.pulseScroll = 0 ;
	
	// this.sceneNode.yaw( 1.5 ) ;
	//	this.sceneNode.rotateLAngleAroundAxis3N( 1.5, 0, 1, 0) ;

//	 this.resetOrientation() ;

	 var self = this ;
	
	 // this.trackingProcess = setInterval( function() { self.update() ; }, 60 )  ;

         this.trackingProcess = ogre.addAnimationProcess( function() { self.update() ; } )  ;         
         
	 return this ;
	} ;

 Connector.prototype.setThickness = function( thickness )
	{
 	 this.thickness = thickness ;
	} ;



 Connector.prototype.update = function()
	{
	 this.reposition() ;
	 this.movePulses() ;
	}
	

 Connector.prototype.movePulses = function()
	{
	 this.pulseScroll += 0.06 ;
		
	 this.pulseScroll = this.pulseScroll % 1 ;
		
	 this.entity.subEntitySet[ 0 ].material.setTextureScroll( this.pulseScroll, 0 ) ;
	}

 Connector.prototype.resetOrientation = function()
	{
	/*
	 var aWorld = this.sceneNodeA.convertLocal3NToWorldV( 0, 0, 0 ) ;
	
//	 var nextZAxis = this.sceneNode.convertWorld3NToLocalV( aWorld[ 0 ], aWorld[ 1 ], aWorld[ 2 ] ) ;

	 var bWorld = this.sceneNodeB.convertLocal3NToWorldV( 0, 0, 0 ) ;

	 var nextZAxis = minus( bWorld, aWorld ) ;

	 
	 var zAxisLocal 		 = [ 0, 0, 1 ] ;
	
	 normalize( nextZAxis ) ;

	 var nextXAxis = crossProd( nextZAxis, zAxisLocal ) ;
	
	 normalize( nextXAxis )
		
	 var nextYAxis = crossProd( nextZAxis, nextXAxis  ) ;

 	 normalize( nextYAxis ) ;
	 this.sceneNode.setOrientationM9N( nextXAxis[ 0 ], nextXAxis[ 1 ], nextXAxis[ 2 ], nextYAxis[ 0 ], nextYAxis[ 1 ], nextYAxis[ 2 ], nextZAxis[ 0 ], nextZAxis[ 1 ], nextZAxis[ 2 ] )
	*/
/*
	 var axisOfRotationLocal = crossProd( aLocal, zAxisLocal ) ;

	 var axisToALocal = minus( zAxisLocal, aLocal ) ;

	 var a2 = dotProd( axisToALocal, axisToALocal ) ;
	 var b2 = dotProd( zAxisLocal, zAxisLocal ) ;
	 var c2 = dotProd( aLocal, aLocal ) ;

	 var b = Math.sqrt( b2 ) ;
	 var c = Math.sqrt( c2 ) ;

	 var angleAlt = Math.acos( ( a2 - b2 - c2 ) / ( -2 * b * c ) ) ;

	 var angle				 = Math.acos( dotProd( aLocal, zAxisLocal ) / (  length(  zAxisLocal ) * length( aLocal ) ) ) ;
	 // var angle				 = Math.acos( dotProd( aLocal, zAxisLocal )  ) ;

	 normalize( axisOfRotationLocal ) ;
		 console.log( "var aLocal = [ " + aLocal[ 0 ] + ', ' + aLocal[ 1 ] + ', ' + aLocal[ 2 ] + ' ]') ;
		 console.log( "var axisOfRotationLocal = [ " + axisOfRotationLocal[ 0 ] + ', ' + axisOfRotationLocal[ 1 ] + ', ' + axisOfRotationLocal[ 2 ] + ' ]' ) ;
		var dp = dotProd( zAxisLocal, axisOfRotationLocal ) ;

		 console.log( "dotprod  = " + dp ) ;
		 console.log( "angle  = " + angle ) ;
		 console.log( "angleAlt  = " + angleAlt ) ;


	//	if( !( angle < .3 ) )
		 	this.sceneNode.rotateLAngleAroundAxis3N( angle , axisOfRotationLocal[ 0 ], axisOfRotationLocal[ 1 ], axisOfRotationLocal[ 2 ] ) ;
			//	this.sceneNode.rotateLAngleAroundAxis3N( .1, 0, 1, 0) ;
		*/
	}

 Connector.prototype.reposition = function()
	{
	 var currentZAxisWorld = this.sceneNode.convertLocal3NToWorldV( 0, 0, 1 ) ;
	
	
	 var aWorld = this.sceneNodeA.convertLocal3NToWorldV( 0, 0, 0 ) ;
	 var bWorld = this.sceneNodeB.convertLocal3NToWorldV( 0, 0, 0 ) ;	

	 var aToBWorld = minus( bWorld, aWorld ) ;



	 var nextPosWorld 		=  plus( aWorld, bWorld ) ;
	     scaleDown( nextPosWorld, 2 ) ;
	
	 var distance  = Math.sqrt( dotProd( aToBWorld, aToBWorld ) ) ;

	 this.sceneNode.setPosition3N( nextPosWorld[ 0 ], nextPosWorld[ 1 ], nextPosWorld[ 2 ] ) ;



	 if( distance != 0 )
		{
		 // console.log( distance ) ;
	 	 this.scaleNode.setScale3N( this.thickness, this.thickness, distance ) ;

	 	 this.entity.subEntitySet[ 0 ].material.setTextureScale( 10.0 / distance, 1.0 ) ;
	
	 	 this.currentLength = distance ;
		}
		
	 // this.resetOrientation() ;
	 var aLocal = this.sceneNode.convertWorld3NToLocalV( aWorld[ 0 ], aWorld[ 1 ], aWorld[ 2 ] ) ;
	
	 var angleAroundZ = Math.atan2( aLocal[ 1 ], aLocal[ 0 ] ) ;
	 
	 var nextX = Math.sqrt( aLocal[ 0 ] * aLocal[ 0 ] + aLocal[ 1 ] * aLocal[ 1 ] ) ;
	
	 var angleAroundY = Math.atan2( nextX, aLocal[ 2 ] ) ;

	
	 this.sceneNode.roll( angleAroundZ ) ;
	 var nextALocal = this.sceneNode.convertWorld3NToLocalV( aWorld[ 0 ], aWorld[ 1 ], aWorld[ 2 ] ) ;

	
	 this.sceneNode.yaw( angleAroundY ) ;
	 var nextALocal = this.sceneNode.convertWorld3NToLocalV( aWorld[ 0 ], aWorld[ 1 ], aWorld[ 2 ] ) ;	
	} ;

 return Connector ;
} ) ;
	
// exports.Connector = Connector ;