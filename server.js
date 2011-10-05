var sys = require( 'sys' ) ;
// require( '../OgreJS/src/js/ogre.js' ).init( ogre ) ;
// require( '../OgreJS/src/js/mygui.js' ).init( gui ) ;
// gui.input.linkToOgreInput( ogre.input ) ;

var net = require( 'net' ) ;

var game = require( './Game/game.js' ) ;

var server = require( './Communication/Server.js' ) ;

// var communication = require( './Communication/communication.js' ) ;
var ex  = require( 'extend' ) ;
// exports.rtsCam = rtsCam ;



// map type

// server setup

// send initial map


var s = ( new server.Server() ).init( 8124, 'localhost' ) ;

exports.game = 

	( new game.Game() ).init
		( 
		 ( new game.EmptyTileFactory() ).init( 10, 10 ), 
		 s 
		) ;

ex.after( s, 'addClientConnection', { addPlayer: function( _, con ) { exports.game.addPlayer( con ) ; } }, 'addPlayer' ) ;

var u = ( new game.Unit() ).init( 10, 10, "bob", exports.game.map )


exports.game.map.addUnit( u ) ;

/*
var t  = 0 ;
var dT = 50 ;

var p = setInterval( function() { u.move( 50 * Math.cos( t / 1000 ), 50 * Math.sin( t / 1000 ) ) ; t += dT ; }, dT ) ;
*/


s.start() ;
// exports.gameManager 	= ( new game.GameManager() ).init( 50, 50 ) ;



/*
exports.map 		= ( new game.Map() 			).init( 50, 50 ) ;


exports.unit = ( new game.Unit() ).init( 10, 10, "drOctogonapus", exports.map ) ;



exports.unit2 = ( new game.Unit() ).init( 20, 20, "bob", exports.map ) ;

exports.unit3 = ( new game.Unit() ).init( 40, 30, "karel", exports.map ) ;

exports.map.addUnit( exports.unit  ) ;

exports.map.addUnit( exports.unit2 ) ;

exports.map.addUnit( exports.unit3 ) ;

*/
console.log( 'DONE') ;
