
var mod = function( extend, Tile, Unit )
{
var after  = extend.after  ;
var before = extend.before ;

	function Map()
		{}



	Map.prototype.init = function( mapFactory ) 
		{

		 this.createTileTable( mapFactory.tileColumnCount, mapFactory.tileRowCount ) ;
		 this.loadTiles( mapFactory  )

		 return this ;
		} ;


	Map.prototype.createTileTable = function( tileColumnCount, tileRowCount )
		{
		 console.log( 'tt ' + tileColumnCount + ' - ' + tileRowCount ) ;

		 this.tileColumnCount  = tileColumnCount  ;
	     this.tileRowCount = tileRowCount ;

	     this.tileTable = new Array( tileColumnCount ) ;

	     for( var i = 0  ; i < this.tileColumnCount ; i++ )
	         this.tileTable[ i ] = new Array( tileRowCount ) ;


	     this.boundX = Tile.prototype.WIDTH_UNITS  * this.tileColumnCount ;
	     this.boundY = Tile.prototype.HEIGHT_UNITS * this.tileRowCount ;

		 console.log( 'TILETABLE CREATED') ;
		} ;

	Map.prototype.xMapWorldToXTile = function( xMapWorld ) { return Math.floor( xMapWorld / Tile.prototype.WIDTH_UNITS ) ; } ;
	Map.prototype.yMapWorldToYTile = function( yMapWorld ) { return Math.floor( yMapWorld / Tile.prototype.HEIGHT_UNITS ) ; } ;

	Map.prototype.tileAtPoint = function( xMapWorld, yMapWorld )
	     {
		  console.log( '-> TILE AT POINT xy ' + xMapWorld + ' ' + yMapWorld ) ;


	      var xTile = this.xMapWorldToXTile( xMapWorld ) ;
	      var yTile = this.yMapWorldToYTile( yMapWorld ) ;

		  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
		  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;	  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
			  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
				  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
					  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;
						  console.log( '-> TILE AT POINT txty ' + xTile + ' ' + yTile ) ;


	//	  if( ! this.tileTable[ xTile ] && xTile != 0 ) process.exit( 0 ) ;

	      return this.tileTable[ xTile ][ yTile ] ;
	     } ;


	Map.prototype.loadTiles = function( tileFactory )
		{
			 console.log( "xy " + this.tileColumnCount + ' ' + this.tileRowCount ) ;


		 for( var xTile = 0 ; xTile < this.tileColumnCount ; xTile ++ )
		 for( var yTile = 0 ; yTile < this.tileRowCount    ; yTile ++ )
			{
			 console.log( "xy " + xTile + ' ' + yTile ) ;
			 this.putTile( tileFactory.create( xTile, yTile  ) ) ;
			}
		} ;


	Map.prototype.putTile = function( tile )
		{
		 console.log( 'puttile' ) ;
		 this.tileTable[ tile.xTile ][ tile.yTile ] = tile ;	
		} ;


	Map.prototype.addUnit = function( unit )
		{
		 return this.trackUnit( unit ) ;	
		} ;



	Map.prototype.trackUnit = function( unit )
	    {
	     var self = this ;



	     var tile = self.tileAtPoint( unit.x, unit.y ) ;

		// if( tile.contains( unit ) ) process.exit(0) ;

		 // if( unit.tile )
		 //	unit.tile.remove( unit ) ;

		 if( ! tile.contains( unit ) )
		 	tile.add( unit ) ;

		 unit.Map = {} ; unit.Map.Track = 
			{
			 assureCoordinateOnMap: function( x, y ) { if( x > self.boundX || y > self.boundY || x < 0 || y < 0 ) {  throw ( new ex.ReturnImmediately( null ) ) ; } },
			 removeFromOldTile: 	function() { self.tileAtPoint( unit.x, unit.y ).remove( unit ) ; unit.tile = null ; },
			 addToNewTile:  		function() { var nextTile = self.tileAtPoint( unit.x, unit.y ) ; nextTile.add( unit ) ; unit.tile = nextTile ; }
			} ;
			
	     after(  unit, 'move', unit.Map.Track, 'addToNewTile' ) ;

	     before( unit, 'move', unit.Map.Track, 'removeFromOldTile' ) ;
	     before( unit, 'move', unit.Map.Track, 'assureCoordinateOnMap' ) ;

		 return tile ;
	    } ;




	Map.prototype.applyToTiles = function( start, end, funcOnTile )
		{
		 var returnArray = [] ;

		 var dX = -1 ;
		 var dY = -1 ;

		 if( start.x < end.x ) dX = 1 ;
		 if( start.y < end.y ) dY = 1 ;

		 console.log( "mws.x " + start.x + " mwe.x " + end.x + " mws.y " + start.y + " mwe.y " + end.y ) ;

	     var xTileStart = this.xMapWorldToXTile( start.x ) ;
	     var yTileStart = this.yMapWorldToYTile( start.y ) ;
	     var xTileEnd   = this.xMapWorldToXTile( end.x   ) ;
	     var yTileEnd   = this.yMapWorldToYTile( end.y   ) ;

		 var nextReturn ; 

		 console.log( "xs " + xTileStart + " xe " + xTileEnd + " ys " + yTileStart + " ye " + yTileEnd ) ;


		 for( var x = xTileStart ; x != xTileEnd + dX ; x += dX )
		 for( var y = yTileStart ; y != yTileEnd + dY ; y += dY )
			{
			 console.log( 'xy ' + x + ' ' + y ) ;

			 nextReturn = funcOnTile( this.tileTable[ x ][ y ] );	

			 if( nextReturn ) returnArray.push( nextReturn ) ;
			}

		 return returnArray ;
		} ;

	Map.prototype.getUnits = function( start, end )
		{ 
		 console.log( 'Map.prototype.getUnits' ) ;

		 return this.applyToTiles( start, end, function( tile ) 
				{
				 var un = tile.collect( function( unit ) { if( unit instanceof Unit ) { console.log( "unit found") ; return unit ; } ; console.log( "not a unit") ;} ) ;

				 if( un.length > 0 ) { console.log( "returning unit" ) ; return un[ 0 ] ; }
				}  ) ; 
		} ;


	Map.prototype.initAfterLoad = function()
		{
		 this.initAddAllUnitsOnMap() ;
		} ;


	Map.prototype.initAddAllUnitsOnMap = function()
		{
		 var unitSet = this.getUnits( { x: 0, y: 0 }, { x: this.boundX - 1, y: this.boundY - 1 } ) ;

		 for( var i in unitSet )
			this.addUnit( unitSet[ i ] ) ;
		} ;

return Map ;




} ;



define( [ 'extend', './Tile.js', './Unit.js' ],mod ) ;