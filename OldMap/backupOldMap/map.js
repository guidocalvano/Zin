
// makes use of raphael.js

function Map( colCount, rowCount )
{
 this.tileTable    ;
    
 this.tileColumnCount ;
 this.tileRowCount    ;
  
 this.tileWidthUnits  ;
 this.tileHeightUnits ;
 
 this.boundX ;
 this.boundY ;
    
    
 this.createTileTable( colCount, rowCount ) ;
    
    
 this.createTileTable = function( tileColumnCount, tileRowCount )
     {
      this.tileColumnCount  = tileColumnCount  ;
      this.tileRowCount = tileRowCount ;
         
      this.tileTable = new Array( tileColumnCount ) ;
         
      for( var i = 0  ; i < this.tileColumnCount ; i++ )
           this.tileTable[ i ] = new Array( tileRowCount ) ;
        
 
      this.boundX = this.tileWidthUnits * this.tileColumnCount ;
      this.boundY = this.tileHeightUnits * this.tileRowCount ;
     } 
     
 
 this.setTileDimensions = function( tileWidthUnits, tileHeightUnits )
     {
      this.tileWidthUnits = tileWidthUnits ;
      this.tileHeightUnits = tileHeightUnits ;  
      
      this.boundX = this.tileWidthUnits * this.tileColumnCount ;
      this.boundY = this.tileHeightUnits * this.tileRowCount ;
     }
     
     
 this.tileAtPoint = function( xWorld, yWorld )
     {
      var xTile = Math.round( xWorld / this.tileWidthUnits  ) ;
      var yTile = Math.round( yWorld / this.tileHeightUnits ) ;
      
          
      return this.tileTable[ xTile ][ yTile ] ;
     }


 this.loadTiles = function( tileFactory )
	{
	 for( xTile = 0 ; xTile < this.tileColumnCount ; xTile ++ )
	 for( yTile = 0 ; yTile < this.tileRowCount    ; yTile ++ )
		this.tileTable[ xTile ][ yTile ] = tileFactory.create( xTile, yTile, this ) ;
	}
    
 this.trackUnit = function( unit )
    {
     var self = this ;
     
     
     
     self.tileAtPoint( unit.x, unit.y ).add( unit ) ;
     
     unit.before( 'move', function() { self.tileAtPoint( unit.x, unit.y ).remove( unit ) ; } ) ;
     unit.before( 'move', function( x, y ) { if( x > self.boundX || y > self.boundY || x < 0 || y < 0 ) throw new ReturnImmediately( null ) ; } ) ;

     unit.after( 'move', function() { self.tileAtPoint( unit.x, unit.y ).add( unit ) ; } ) ;
    }
  
}

function Unit( x, y, map )
{

 this.x = x ;
 this.y = y ;
 
 this.map = map ;
 
 this.image = paper.rect( x, y, 9, 9 ) ;
 this.image.attr( 'fill', 'rgb( 255, 0, 0 )' ) ;
 
  var self = this ;

 this.updateImage = function()
    {
     this.image.attr( { x: this.x, y: this.y } ) ;   
    }
 
 this.move = function( newX, newY )
    {
     this.x = newX ;
     this.y = newY ;
    }

 this.after( 'move', function() { self.updateImage() ; } ) ;

 this.moonWalk = function()
    {
    
     this.move( this.x + 1, this.y + 1 ) ;
     
     setTimeout( function() { self.moonWalk() ; }, 300 ) ;
    }

}



function MichaelJacksonMapView( model  )
{
 this.mapModel = model ;
 this.mapModel.createTileTable( 100,100 ) ;
 this.mapModel.setTileDimensions( 15, 15 ) ;
 this.mapModel.loadTiles( new EmptyTileFactory() ) ;
 
 this.tileViewTable = new Array( this.mapModel.tileTable.length )
 
 
 for( var tileColumn = 0 ; tileColumn < this.mapModel.tileTable.length ; tileColumn++ )
    {
     this.tileViewTable[ tileColumn ] = new Array( this.mapModel.tileTable[ tileColumn ].length ) ;
    
     for( tileRow = 0 ; tileRow < this.mapModel.tileTable[ tileColumn ].length ; tileRow++  )
        
         this.tileViewTable[ tileColumn ][ tileRow ] = new MichaelJacksonTileView( this.mapModel.tileTable[ tileColumn ][ tileRow ] ) ;
        
    }
} 




     
function Tile( xTile, yTile, map )
{
 this.xTile = xTile ;
 this.yTile = yTile ;
 this.widthUnits  = map.tileWidthUnits ;
 this.heightUnits = map.tileHeightUnits ;

 this.isTraversable = true ;
 
 this.content = new Array() ;

 this.add = function( newContent )
	{
	 this.content.push( newContent ) ;
	}

 this.remove = function( oldContent )
	{
	 for( i = 0 ; i < this.content.length ; i++ )
		if( this.content[ i ] == oldContent )
			this.content.splice( i, 1 ) ;
	}
}
     

function EmptyTileFactory()
{
 this.create = function( xTile, yTile, map ) { return new Tile( xTile, yTile, map ) ; }
}

function MichaelJacksonTileView( tile )
{
 this.tile = tile ;


 this.image = paper.rect( tile.xTile * tile.widthUnits, tile.yTile * tile.heightUnits, tile.widthUnits, tile.heightUnits ) ;

 this.setTileColor = function()
	{
	 var darkestColor = 80 ;

	 var intensityRange = 255 - darkestColor ;
	 var color = darkestColor + ( intensityRange - intensityRange / ( this.tile.content.length + 1 ) )


	 // this.image.attr( { fill: 'rgb( ' + color + ', ' + color + ', ' + color + ' )' } ) ;
     this.image.attr( { fill: 'rgb( '+color+', ' + color + ', ' + color + ' )' } ) ;
	}

 this.setTileColor() ;

 var self = this ;
 this.tile.after( 'add', function() { self.setTileColor() ; } ) ;
 this.tile.after( 'remove', function() { self.setTileColor() ; } ) ;
 

}



function testMap()
	{
	 initGraphics() ;

	 paper.circle( 500, 500, 500 ) ;

	 map = new Map() ;
     
     mapView = new MichaelJacksonMapView( map ) ;
     
     michael = new Unit( 50, 50 ) ;
     
     map.trackUnit( michael ) ;
     
     michael.moonWalk() ;
	}


