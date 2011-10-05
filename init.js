var sys = require( 'sys' ) ;
require( '../OgreJS/src/js/ogre.js' ).init( ogre ) ;
require( '../OgreJS/src/js/mygui.js' ).init( gui ) ;
gui.input.linkToOgreInput( ogre.input ) ;



var game = require( './Game/game.js' ) ;

// exports.rtsCam = rtsCam ;


exports.game = game ;


exports.map 		= ( new game.Map() 			).init( 50, 50 ) ;
exports.mapControl	= ( new game.MapControl() 	).init( exports.map ) ;


var GuiControlJS = require( './GUI/GuiControl.js' ) ;
// var RTSCam = require( './GUI/RTSCameraControl.js' ) ;

var guiControl =  ( new GuiControlJS.GuiControl() ).init( exports.map ) ;
// var rtsCam = ( new RTSCam.RTSCameraControl() ).init(  ogre.root, ogre.camera ) ;

exports.unit = ( new game.Unit() ).init( 10, 10, "drOctogonapus", exports.map ) ;
exports.unitControl = ( new game.UnitControl() ).init( exports.unit, exports.mapControl.node ) ;



exports.unit2 = ( new game.Unit() ).init( 20, 20, "drOctogonapus", exports.map ) ;
exports.unitControl2 = ( new game.UnitControl() ).init( exports.unit2, exports.mapControl.node ) ;




exports.unit3 = ( new game.Unit() ).init( 30, 30, "drOctogonapus", exports.map ) ;
exports.unitControl3 = ( new game.UnitControl() ).init( exports.unit3, exports.mapControl.node ) ;


exports.map.addUnit( exports.unit ) ;


// exports.unitControl.select() ;
/*
var t = 0 ;

exports.unitMove = setInterval( 
	function() { exports.unit.move( 10 * Math.cos( t ), 10 * Math.sin( t ) ) ; t += 6.28 / 100 ; },
	100 ) ;
	*/
/*
ogre.Camera.prototype.__proto__ =  new extendable.Extendable() ;
ogre.SceneNode.prototype.__proto__ =  new extendable.Extendable() ;
ogre.Entity.prototype.__proto__ =  new extendable.Extendable() ;
ogre.input.prototype =  new extendable.Extendable() ;

gui.Component.prototype.__proto__ = new extendable.Extendable() ;
*/

exports.sky = new ogre.Entity( 'sky.mesh' ) ;
exports.sky.setParent( ogre.root ) ;


exports.grass = new Array( 10 ) ;
/*
exports.pn = new ogre.SceneNode() ;
exports.pn.setParent( ogre.root ) ;
for( var x = 0 ; x < 10 ; x++ )
	{
		
	 exports.grass[ x ] = new Array( 10 ) ;
		
	 for( var y = 0 ; y < 10 ; y++ )
		{
		 var sn = new ogre.SceneNode() ;
		 var g  = new ogre.Entity( 'tileSelect.mesh' ) ;
		
		 sn.setParent( exports.pn ) ;
		 g.setParent( sn ) ;
		
		 sn.moveL3N( 10 * x , 10 * y, 0 ) ;
		
		 exports.grass[ x ][ y ] = { g: g, sn: sn } ;
		}
		
	}
*/
/*
exports.tile = new ogre.Entity( 'tile.mesh' ) ;
exports.tileNode = new ogre.SceneNode() ;
exports.tileNode.setParent( ogre.root ) ;
exports.tile.setParent( exports.tileNode ) ;
*/
/*
exports.unit = new ogre.Entity( 'unitMeshCombined.mesh' ) ;
exports.unitNode = new ogre.SceneNode() ;
exports.unitNode.setParent( ogre.root ) ;
exports.unit.setParent( exports.unitNode ) ;
*/
ogre.start( 100 ) ;

console.log( 'DONE') ;
