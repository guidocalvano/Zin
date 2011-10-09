
var mod = function( Tile )
{
function TileControl(){} 

TileControl.prototype.init = function( tile, parentNode )
	{
	 this.tile = tile ;
	
	 tile.Control = this ;

	 this.node 		= ( new ogre.SceneNode() ).init() ;
	 this.entity	= ( new ogre.Entity() ).init( 'tile.mesh' ) ;

	 this.entity.setParent( this.node ) ;
	
	 this.entity.Control = this ;
	
	 this.node.setParent( parentNode ) ;

	 this.node.moveL3N( tile.xTile * Tile.prototype.WIDTH_UNITS, tile.yTile * Tile.prototype.HEIGHT_UNITS, 0 ) ;
	

//	 var self = this ;
//	 this.tile.after( 'add', function() { self.setTileColor() ; } ) ;
//	 this.tile.after( 'remove', function() { self.setTileColor() ; } ) ;

	 return this ;

	}


TileControl.prototype.highlight = function()
	{
	 if( !this.highlightEntity )
		{
	 	 this.highlightEntity = ( new ogre.Entity() ).init( 'tileSelect.mesh' ) ; 
	 	 this.highlightEntity.Control = this ;
		}
	
	 this.highlightEntity.setParent( this.node ) ;
	} ;



TileControl.prototype.unhighlight = function()
	{
	 this.highlightEntity.setParent( null ) ;
	} ;
	
	
return TileControl ;
} ;


define( [ '../Game/Tile.js' ], mod ) ;