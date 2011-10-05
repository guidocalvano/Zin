var sys = require( 'sys' ) ;
require( '../OgreJS/src/js/ogre.js' ).init( ogre ) ;
require( '../OgreJS/src/js/mygui.js' ).init( gui ) ;
gui.input.linkToOgreInput( ogre.input ) ;



var game = require( './Game/game.js' ) ;

var ServerConnection = require( './Communication/ServerConnection.js')

var net = require( 'net' ) ;

var communication = require( './Communication/communication.js')

/*
var client = net.createConnection( 8124 ) ;

client.on( 'connection', function() { console.log('CONNECTION connection established' ) ; } ) ;

client.on( 'data', function( message ) { console.log('CONNECTION message received ' + message) ; } ) ;

client.on( 'close', function( message ) { console.log( 'CONNECTION connection closed' ) ; } ) ;
*/



exports.game = game ;


var serverConnection = ( new ServerConnection.ServerConnection() ).init( 8124, 'localhost' ) ;


var gameControl =  ( new game.GameControl() ).init( serverConnection ) ;




ogre.start( 100 ) ;

console.log( 'DONE') ;
