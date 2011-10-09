

var sys = require( 'sys' ) ;
require( '../OgreJS/src/js/ogre.js' ) ; // .init( ogre ) ;
require( '../OgreJS/src/js/mygui.js' ) ; // .init( gui ) ;
gui.input.linkToOgreInput( ogre.input ) ;



var GameControl = require( './GUI/GameControl.js' ) ;

var ServerConnection = require( './Communication/ServerConnection.js')

var gameControl =  ( new GameControl() ).init( ( new ServerConnection() ).init( 8124, 'localhost' ) ) ;




ogre.start( 100 ) ;

console.log( 'DONE') ;
