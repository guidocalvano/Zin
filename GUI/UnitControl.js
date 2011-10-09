
var mod = function( extend, Tile ) 
{
var after  = extend.after  ;
var before = extend.before ;
function UnitControl() {} 

UnitControl.prototype.init = function( unit, parent )
	{
	 this.unit = unit ;
	
	 this.node = ( new ogre.SceneNode() ).init() ;
	
	 this.node.setParent( parent ) ;
	
//	 this.node.moveL3N( unit.x, unit.y, 0 ) ;
	
	 this.entity = ( new ogre.Entity() ).init( 'unitMeshCombined.mesh' ) ;	
	
	 this.entity.setParent( this.node ) ;
	
	 this.entity.Control = this ;
	
	 this.unit.Control = this ;
	
	 // this.selected = new ogre.Entity( 'unitMeshCombinedSelect.mesh' ) ;
	
	 // this.selected.setParent( this.node ) ;
	
	 this.move( unit.x, unit.y ) ;
	
	 after( unit, "move", this, "move" ) ;
	
	 return this ;
	}


UnitControl.prototype.mousePressedOnControl = function( event, control )
	{
	 if( control.constructor.name == 'TileControl' ) 
		{
		 this.unit.Agent.DomainElementShadow.executeRemote( 'moveTo', [ control.tile.xTile * Tile.prototype.WIDTH_UNITS, control.tile.yTile * Tile.prototype.HEIGHT_UNITS ] ) ;
		} ;
	
		
	} ;

	
UnitControl.prototype.move = function( newX, newY )
	{
	
	 var o = this.node.convertLocalOXYZToParentOXYZ( { x: 0, y: 0, z: 0 } )  ;	

	 var heading = this.node.convertParentOXYZToLocalOXYZ( { x: newX, y: newY, z: 0 } ) ;
	
		
	 var newPosParentOXYZ = { x: newX, y: newY, z: 0  } ;
	
	 var newPosLocalOXYZ  = this.node.convertParentOXYZToLocalOXYZ( newPosParentOXYZ ) ;
	
	 this.node.moveL3N( newPosLocalOXYZ.x, newPosLocalOXYZ.y, 0 ) ;	


	 if( heading.x == 0 && heading.y == 0 ) return ;
	
	 var controlYaw = Math.atan2( -heading.x, heading.y ) ;
	

	
	 this.node.roll( controlYaw ) ; // because the z axis points upward rather than forward, and the y axis
												// points forward in its stead, roll must be called. Yaw is clearer 
												// about what is happening so it is used throughout the rest of the code.
	} ;





UnitControl.prototype.select = function()
	{
	 if( !this.selectEntity )
		{
	 	 this.selectEntity = ( new ogre.Entity() ).init( 'unitMeshCombinedSelect.mesh' ) ; 
	 	 this.selectEntity.Control = this ;
		}

	 this.selectEntity.setParent( this.node ) ;
	
	 console.log( "unit selected" ) ;
	} ;



UnitControl.prototype.unselect = function()
	{
	 this.selectEntity.setParent( null ) ;
	} ;

return UnitControl ;

} ;
define( [ 'extend', '../Game/Tile' ], mod ) ;