

var mod = function( ex, Control, TileControl, UnitControl )
{

 
function MapControl() { }

MapControl.prototype = new Control() ;

MapControl.prototype.init = function( map )
	{
	 console.log( 'MapControl.init' ) ;
	 this.map = map ;
	
	 // map.Control = this ;
	
//	 console.log( MapControl.prototype.____key ) ;
	
//	 if( MapControl.prototype.____key ) { console.log( 'yes' ) ; process.exit(0) ; } ;
	
//	 if( ! MapControl.prototype.____key ) { console.log( 'no' ) ; process.exit(0) ; } ;

//	 if( MapControl.prototype.____key == "pjotr" ) process.exit( 0 ) ;
	
	 ex.setEmbedded( map, MapControl.prototype, this ) ;
	
	 this.node = ( new ogre.SceneNode() ).init() ;
	
	 this.node.setParent( ogre.root ) ;
		
	 // this.tileControlTable = new Array( this.map.tileTable.length ) ;

	 for( var tileColumn = 0 ; tileColumn < this.map.tileTable.length ; tileColumn++ )
		{
	     // this.tileControlTable[ tileColumn ] = new Array( this.map.tileTable[ tileColumn ].length ) ;
		
		 for( tileRow = 0 ; tileRow < this.map.tileTable[ tileColumn ].length ; tileRow++  )
			{
			 console.log( 'tile! ' + tileColumn + ' ' + tileRow ) ;
			 // console.log( ' tx ty ' + tileColumn + ' ' + tileRow + ' ' + this.map.tileTable[ tileColumn ][ tileRow ].constructor.name ) ;
	         // this.tileControlTable[ tileColumn ][ tileRow ] = 
			 ( new TileControl() ).init( this.map.tileTable[ tileColumn ][ tileRow ], this.node ) ;	    	
			}
		}
	
	console.log( 'tiles made' ) ;
	 var unitSet = map.getUnits( [ 0, 0 ], [ map.boundX - 1, map.boundY - 1 ] ) ;
	
	for( var i in unitSet )
		(new UnitControl()).init( unitSet[ i ], this.node ) ;
	
	 return this ;
	} ;

/*
MapControl.prototype.init = function( map )
	{
	 console.log( 'MapControl.init' ) ;
	 this.map = map ;

	 map.Control = this ;

	 this.node = ( new ogre.SceneNode() ).init() ;

	 this.node.setParent( ogre.root ) ;

	 for( var tileColumn = 0 ; tileColumn < this.map.tileTable.length ; tileColumn++ )
	 for( tileRow = 0 ; tileRow < this.map.tileTable[ tileColumn ].length ; tileRow++  )

		( new TileControl() ).init( this.map.tileTable[ tileColumn ][ tileRow ], this.node ) ;	    				


	 var unitSet = map.getUnits( { x: 0, y: 0 }, { x: map.boundX - 1, y: map.boundY - 1 } ) ;

	 for( var i in unitSet )
		(new UnitControl()).init( unitSet[ i ], this.node ) ;

	 return this ;
	} ;
*/


MapControl.prototype.convertWorld3NToMapWorldV2 = function( x, y, z )
	{
	 var localV = this.node.convertWorld3NToLocalV.apply( this.node, arguments ) ;
	
	 // var mapWorldOXY = { x: localOXYZ.x, y: localOXYZ.y } ;
	 // var mapWorldOXY = { x: localOXYZ.x, y: localOXYZ.y } ;
	
	 // return mapWorldOXY ;
	 return [ localV[ 0 ], localV[ 1 ] ] ;
	} ;


MapControl.prototype.highlightTiles = function( start, end )
	{
	 this.map.applyToTiles( start, end, function( tile ) { ex.getEmbedded( tile, TileControl.prototype ).highlight() ; } ) ;	
	} ;


MapControl.prototype.unhighlightTiles = function( start, end )
	{
	 this.map.applyToTiles( start, end, function( tile ) { ex.getEmbedded( tile, TileControl.prototype ).unhighlight() ; } ) ;	
	} ;
	
return MapControl ;
} ;


define( [ 'extend', './Control.js', './TileControl.js', './UnitControl.js' ], mod ) ;