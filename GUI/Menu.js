
// var Connector = require( './Connector.js' ).Connector ;
define( ['./Connector.js' ], 
function( Connector ) {

function MenuItem() {}




MenuItem.prototype.init = function( parent, entity, camera, radius, itemScale, thickness )
	{
	 this.parent = parent ;
		
	 this.hubConnection 	= ( new ogre.SceneNode() ).init() ;
	 this.itemConnection	= ( new ogre.SceneNode() ).init() ;
	 this.itemScaleNode 	= ( new ogre.SceneNode() ).init() ;

	 this.entity = entity ;

	 this.entity.setParent( 	this.itemScaleNode ) ;		
	 this.itemScaleNode.setParent( 	this.itemConnection ) ;		
	 this.itemConnection.setParent( this.hubConnection ) ;
	 this.hubConnection.setParent( 	this.parent ) ;


	 this.itemConnection.setPosition3N( radius, 0, 0 ) ;

	 this.itemScaleNode.setScale3N( itemScale, itemScale, itemScale ) ;
	
//	 this.hubConnection.pitch( 1.57 ) ;

 	 this.camera = camera ;

	 this.connector = ( new Connector() ).init( this.hubConnection, this.itemConnection ) ;

	 this.connector.setThickness( thickness ) ;

	 return this ;
	} ;


MenuItem.prototype.attachName = function( name )
	{
	 this.overlay = ( new gui.Overlay() ).init( 300, 40, this.itemConnection, this.camera.tiltNode ) ;
	
	 this.text = ( new gui.Text() ).init( null, 0, 0, 300, 40 ) ;
	 this.text.setText( "id " + name ) ;
	
	 this.text.setParent( this.overlay ) ;
	} ;	

	
	
function Menu() {}

Menu.prototype.init = function( parent, camera, place, radius, itemScale, connectorThickness  )
	{
	 this.camera = camera ;	

	 this.radius = radius ;

	 this.connectorThickness = connectorThickness ;

	 this.itemScale = itemScale ;
		
	 this.hubNode = ( new ogre.SceneNode() ).init() ;
	
	 this.hubNode.setParent( parent ) ;

	 this.hubNode.setPosition3N( place[ 0 ], place[ 1 ], place[ 2 ] ) ;

	 this.itemCount = 0 ;
	
	 this.menuItemSet = [] ;
	
	 this.menuItemConnectionSet = [] ;
	
	 var self = this ;
	
	 var time = 0 ;

	
	 this.hubSphereEntity = ( new ogre.Entity() ).init( 'sphere.mesh' ) ;

	 this.hubSphereScaleNode = ( new ogre.SceneNode() ).init() ;

 	 this.hubSphereEntity.setParent( this.hubSphereScaleNode ) ;

 	 this.hubSphereScaleNode.setParent( this.hubNode ) ;

	 this.hubSphereScaleNode.setScale3N( itemScale, itemScale, itemScale ) ;

	 return this ;
	} ;


	
Menu.prototype.createItemWithName 	= function( name )
	{
	 var nextMenuItemConnection = ( new ogre.SceneNode() ).init() ;

	 nextMenuItemConnection.setParent( this.hubNode ) ;

	 this.menuItemConnectionSet.push( nextMenuItemConnection ) ;

	 var item = ( new MenuItem() ).init( nextMenuItemConnection, ( new ogre.Entity() ).init( 'sphere.mesh' ), this.camera, this.radius, this.itemScale, this.connectorThickness ) ;

	 this.menuItemSet.push( item ) ;
	 
	 item.attachName( name ) ;

	 this.reinitializeMenuItemConnections() ;

	} ;
	
	
Menu.prototype.reinitializeMenuItemConnections = function()
	{
	 var dAngle = ( Math.PI * 2.0 ) / this.menuItemConnectionSet.length ;
		
	 for( var i = 0 ; i < this.menuItemConnectionSet.length ; i++ )	
		{
		 this.menuItemConnectionSet[ i ].resetOrientation() ;
		 this.menuItemConnectionSet[ i ].setOrientationByAngleAndAxis4N( dAngle * i, 0, 0, 1 ) ;	

		 if( this.menuItemSet[ i ][ 'text' ] !== undefined )
			 this.menuItemSet[ i ].text.setText( 'id ' + i + ' angle ' + dAngle * i ) ;		
		}
		
	} ;
	
	
Menu.prototype.createItemWithEntity 	= function( entity )
	{
	 var nextMenuItemConnection = ( new ogre.SceneNode() ).init() ;
	
	 nextMenuItemConnection.setParent( this.hubNode ) ;
	
	 this.menuItemConnectionSet.push( nextMenuItemConnection ) ;
	
	// this.reinitializeMenuItemConnections() ;
		
	 var item = ( new MenuItem() ).init( nextMenuItemConnection, entity, this.camera ) ;
	
	 this.menuItemSet.push( item ) ;
	
	 
	} ;

 return Menu ;

} ) ;
	
// exports.Menu = Menu ;
	
	
	