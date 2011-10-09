

var mod = function( TileControl, UnitControl )
{


function MapControl() {}

MapControl.prototype.init = function( map )
	{
	 console.log( 'MapControl.init' ) ;
	 this.map = map ;
	
	 map.Control = this ;
	
	 this.node = ( new ogre.SceneNode() ).init() ;
	
	 this.node.setParent( ogre.root ) ;
		
	 this.tileControlTable = new Array( this.map.tileTable.length ) ;

	 for( var tileColumn = 0 ; tileColumn < this.map.tileTable.length ; tileColumn++ )
		{
	     this.tileControlTable[ tileColumn ] = new Array( this.map.tileTable[ tileColumn ].length ) ;
		
		 for( tileRow = 0 ; tileRow < this.map.tileTable[ tileColumn ].length ; tileRow++  )
			{
			 console.log( ' tx ty ' + tileColumn + ' ' + tileRow + ' ' + this.map.tileTable[ tileColumn ][ tileRow ].constructor.name ) ;
	         this.tileControlTable[ tileColumn ][ tileRow ] = ( new TileControl() ).init( this.map.tileTable[ tileColumn ][ tileRow ], this.node ) ;	    	
			}
		 console.log( 'tile row created: ' + tileColumn ) ;
		}
	
		 console.log( 'TILECONTROLTABLE CREATED') ;
	
	 var unitSet = map.getUnits( { x: 0, y: 0 }, { x: map.boundX - 1, y: map.boundY - 1 } ) ;
	
	for( var i in unitSet )
		(new UnitControl()).init( unitSet[ i ], this.node ) ;
	
	 return this ;
	} ;


MapControl.prototype.convertWorldOXYZToMapWorldOXY = function( worldOXYZ )
	{
	 var localOXYZ = this.node.convertWorldOXYZToLocalOXYZ( worldOXYZ ) ;
	
	 var mapWorldOXY = { x: localOXYZ.x, y: localOXYZ.y } ;
	 // var mapWorldOXY = { x: localOXYZ.x, y: localOXYZ.y } ;
	
	 return mapWorldOXY ;
	} ;


MapControl.prototype.highlightTiles = function( start, end )
	{
	 this.map.applyToTiles( start, end, function( tile ) { tile.Control.highlight() ; } ) ;	
	} ;


MapControl.prototype.unhighlightTiles = function( start, end )
	{
	 this.map.applyToTiles( start, end, function( tile ) { tile.Control.unhighlight() ; } ) ;	
	} ;
	
return MapControl ;
} ;


define( [ './TileControl.js', './UnitControl.js' ], mod ) ;