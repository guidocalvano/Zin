require( '../OgreJS/src/js/ogre.js' ).init( ogre ) ;

var t = setInterval( function() { ogre.input.captureUI() ; ogre.camera.renderOneFrame() ; }, 60 ) ;
var e = new ogre.Entity( 'unitMeshCombined.mesh' ) ;

var sn = new ogre.SceneNode() ;
sn.setParent( ogre.root ) ;
e.setParent( sn ) ;
sn.moveL3N( 0,0,100 );

exports.e  =  e ;
exports.sn = sn ;