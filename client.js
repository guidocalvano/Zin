

var sys = require( 'sys' ) ;
require( '../OgreJS/src/js/ogre.js' ) ; // .init( ogre ) ;
require( '../OgreJS/src/js/mygui.js' ) ; // .init( gui ) ;
gui.input.linkToOgreInput( ogre.input ) ;



var GuiControl = require( './GUI/GuiControl.js' ) ;

var ServerConnection = require( './Communication/ServerConnection.js')

var guiontrol =  ( new GuiControl() ).init( ( new ServerConnection() ).init( 8124, 'localhost' ), true ) ;




ogre.start( 100 ) ;

console.log( 'DONE') ;
