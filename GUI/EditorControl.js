var mod = function( extend, Menu )
{
 var after  = extend.after  ;
 var before = extend.before ;


 function EditorControl() {}


 EditorControl.prototype.init = function( domainClient, camera )
	{
	 this.camera = camera ;
     
     
     this.domainClient = domainClient ;
     
      after( this.domainClient, 'initializeElements', this, 'afterDomainInitialized' ) ;

		
	 return this ;
	} ;


 EditorControl.prototype.afterDomainInitialized = function( _, objectSet )
	{
	 for( var i in objectSet )	
		{

		 if( objectSet[ i ].constructor.prototype == Map.prototype )
			{
			 var map = objectSet[ i ] ;			

			 map.initAfterLoad() ;
			
			 this.mapControl = ( new MapControl() ).init( map ) ;
			}
		}	
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

define( [ 'extend','./Menu.js' ], mod ) ;