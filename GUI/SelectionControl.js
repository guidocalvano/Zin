
var mod = function( ex, Control, Selection )
{
	
function SelectionControl() {} 

SelectionControl.prototype.init = function( map )
	{
	 this.selected = ( new Selection() ).init( [] ) ;
	
	 this.map = map ;
		
	 return this ;
	} ;

SelectionControl.prototype.startSelection = function( event )
	{
	 console.log( 'SelectionControl.STARTSelection( )') ;	
	 
	 var mapHitPoint = ex.getEmbedded( this.map, Control.prototype ).convertWorldOXYZToMapWorldOXY( event.hit.point ) ;
	
//	 console.log( 'mapHitPoint x ' + mapHitPoint.x + ' y ' + mapHitPoint.y ) ;
		
	 this.selectionStart = mapHitPoint ;
	 this.selectionEnd   = mapHitPoint ;
	
	 this.selectionMode = true ;
	
	 ex.getEmbedded( this.map, Control.prototype ).highlightTiles( this.selectionStart, this.selectionEnd ) ;
	} ;
	
	
SelectionControl.prototype.changePreliminarySelection = function( event ) 
	{
//	 console.log( 'SelectionControl.changePreliminarySelection( )') ;	
	
	 ex.getEmbedded( this.map, Control.prototype ).unhighlightTiles( this.selectionStart, this.selectionEnd ) ;
	
	 if(  event.hit && event.hit.entity && ex.getEmbedded( event.hit.entity, Control.prototype )  )
		{
	 	 var mapHitPoint = ex.getEmbedded( this.map, Control.prototype ).convertWorldOXYZToMapWorldOXY( event.hit.point ) ;
	
	 	 this.selectionEnd   = mapHitPoint ;	
		}
		
	 ex.getEmbedded( this.map, Control.prototype ).highlightTiles( this.selectionStart, this.selectionEnd ) ;
	
	} ;
	
	
SelectionControl.prototype.finishSelection = function( event )
	{
	 console.log( 'SelectionControl.finishSelection( )') ;	
		
	 this.changePreliminarySelection( event ) ;
		
	 ex.getEmbedded( this.map, Control.prototype ).unhighlightTiles( this.selectionStart, this.selectionEnd ) ;
	
	 var unitsArray = this.map.getUnits( this.selectionStart, this.selectionEnd ) ;
	
	 console.log( 'getUnits complete' ) ;
	
	 this.selected.unselect() ;
	
	 this.selected.select( unitsArray ) ;
		
	 this.selectionMode = false ;
	} ;
	
SelectionControl.prototype.abortSelection  = function()
	{
	 ex.getEmbedded( this.map, Control.prototype ).unhighlightTiles( this.selectionStart, this.selectionEnd ) ;
	 
	 this.selectionMode = false ;
	} ;
	


SelectionControl.prototype.mousePressedOnEntity  = function( event, entity )
	{
	 console.log( 'SelectionControl.mousePressedOnEntity( )') ;	
	
	
	 if(  !entity || ! ex.getEmbedded( entity, Control.prototype )  ) { return ; } // clicking on the skydome or something... d'Oh!
	
	 if( this.selected.mousePressedOnControl( event, ex.getEmbedded( entity, Control.prototype ) ) ) return ; // the entity acted on the mousepress on the entity and which aborts further selection behavior
				
		 // the entity did not consume the click, it could either be a 3D button or the user wants to make a new selection
		
	 if( !ex.getEmbedded( entity, Control.prototype ).mousePressed || !ex.getEmbedded( entity, Control.prototype ).mousePressed( event )  )
		if( event.leftIsDown ) // it isn't a button so on a left click enter selection mode
			{
			 this.startSelection( event )  ;
			}
		
	} ;
	

SelectionControl.prototype.mouseMovedOnEntity    = function( event, entity ) 
	{
	 // console.log( 'mouse moved on entity. selection control') ;
	 if( this.selectionMode )
		{
		 if(  entity && ex.getEmbedded( entity, Control.prototype )  )
		 	this.changePreliminarySelection( event ) ;
		
		 return ;
		}
	} ;	
	
	
SelectionControl.prototype.mouseReleasedOnEntity = function( event, entity ) 
	{
	 if( this.selectionMode )
		this.finishSelection( event ) ;
	} ;
	
return SelectionControl ;	
} ;

define( [ 'extend', './Control.js', './Selection.js'], mod ) ;
