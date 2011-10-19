var sys = require( 'sys' ) ;
// require( '../OgreJS/src/js/ogre.js' ).init( ogre ) ;
// require( '../OgreJS/src/js/mygui.js' ).init( gui ) ;
// gui.input.linkToOgreInput( ogre.input ) ;

var net = require( 'net' ) ;

var Game = require( './Game/Game.js' ) ;

var EmptyTileFactory = require( './Game/EmptyTileFactory.js' ) ;

var Unit = require( './Game/Unit.js' ) ;


var Server = require( './Communication/Server.js' ) ;

var extend  = require( 'extend' ) ;

var after = extend.after ;

var s = ( new Server() ).init( 8124, 'localhost' ) ;

var game = 

	( new Game() ).init
		( 
		 ( new EmptyTileFactory() ).init( 3, 3 ), 
		 s 
		) ;

after( s, 'addClientConnection', { addPlayer: function( _, con ) { game.addPlayer( con ) ; } }, 'addPlayer' ) ;

var u = ( new Unit() ).init( 10, 10, "bob", game.map )


game.map.addUnit( u ) ;

// setInterval( function() { u.move( Math.random() * 50, Math.random() * 50 ) }, 150 ) ;


s.start() ;

console.log( 'DONE') ;
