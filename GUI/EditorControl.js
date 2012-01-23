var mod = function( Menu )
{

 function EditorControl() {}


 EditorControl.prototype.init = function( serverConnection, camera )
	{
	 this.camera = camera ;
		
	 return this ;
	} ;


 EditorControl.prototype.afterDomainInitialized = function( _, objectSet )
	{
	
	} ;


 EditorControl.prototype.bindGuiEvents = function()
	{

	} ;


 EditorControl.prototype.mouseMoved = function( event )
	{

	} ;


 EditorControl.prototype.mousePressed = function( event, entity )
	{ 
	 console.log( 'EditorControl ' + Menu ) ;	
	 
	 var menu = ( new Menu() ).init( entity.parent, this.camera, [ 0, 0, 30 ], 20, .8, 5  ) ;
	 
	 for( var i = 0 ; i < 5 ; i++ )
 	 	menu.createItemWithName( 'item ' + i  ) ;
	 
	} ;


 EditorControl.prototype.mouseReleased = function( event )
	{

	} ;

 return EditorControl ;
} ;

define( [ './Menu.js' ], mod ) ;