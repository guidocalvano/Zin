
function Selection() {} 

Selection.prototype.init = function( unitsArray )
	{
	 this.selectedUnitsArray = [] ;
	
	 this.select( unitsArray ) ;
	
	 return this ;
	} ;


Selection.prototype.select = function( unitsArray )
	{
	 var nextUnit ;
	 for( var unit in unitsArray )
		{
		 nextUnit = unitsArray[ unit ] ;

		 if( nextUnit )
			{
			 this.selectedUnitsArray.push( nextUnit ) ;
			 nextUnit.Control.select() ;
			}
		}
		
	}
	
Selection.prototype.unselect = function()
	{
	 for( var unit in this.selectedUnitsArray )
	 	this.selectedUnitsArray[ unit ].Control.unselect() ;
	
	 this.selectedUnitsArray = [] ;
	} ;



Selection.prototype.mouseMovedOnControl    = function( event, control ) 
	{
	 for( var unit in this.selectedUnitsArray )
	 	this.selectedUnitsArray[ unit ].Control.mouseMovedOnControl( event, control ) ;
	} ;


Selection.prototype.mousePressedOnControl = function( event, control )
	{
	 for( var unit in this.selectedUnitsArray )
	 	this.selectedUnitsArray[ unit ].Control.mousePressedOnControl( event, control ) ;		
	} ;


Selection.prototype.mouseReleasedOnControl    = function( event, control ) 
	{
	 for( var unit in this.selectedUnitsArray )
	 	this.selectedUnitsArray[ unit ].Control.mouseReleasedOnControl( event, control ) ;
	} ;


function SelectionControl() {} 

SelectionControl.prototype.init = function( map )
	{
	 this.selected = ( new Selection() ).init( [] ) ;
	
	 this.map = map ;
		
	 return this ;
	} ;

SelectionControl.prototype.startSelection = function( event )
	{
	 console.log( 'SelectionControl.startSelection( )') ;	
	 
	 var mapHitPoint = this.map.Control.convertWorldOXYZToMapWorldOXY( event.hit.point ) ;
	
	 console.log( 'mapHitPoint x ' + mapHitPoint.x + ' y ' + mapHitPoint.y ) ;
		
	 this.selectionStart = mapHitPoint ;
	 this.selectionEnd   = mapHitPoint ;
	
	 this.selectionMode = true ;
	
	 this.map.Control.highlightTiles( this.selectionStart, this.selectionEnd ) ;
	} ;
	
	
SelectionControl.prototype.changePreliminarySelection = function( event ) 
	{
	 console.log( 'SelectionControl.changePreliminarySelection( )') ;	
	
	 this.map.Control.unhighlightTiles( this.selectionStart, this.selectionEnd ) ;
	
	 if( event.hit && event.hit.entity && event.hit.entity.Control )
		{
	 	 var mapHitPoint = this.map.Control.convertWorldOXYZToMapWorldOXY( event.hit.point ) ;
	
	 	 this.selectionEnd   = mapHitPoint ;	
		}
		
	 this.map.Control.highlightTiles( this.selectionStart, this.selectionEnd ) ;
	
	} ;
	
	
SelectionControl.prototype.finishSelection = function( event )
	{
	 console.log( 'SelectionControl.finishSelection( )') ;	
		
	 this.changePreliminarySelection( event ) ;
		
	 this.map.Control.unhighlightTiles( this.selectionStart, this.selectionEnd ) ;
	
	 var unitsArray = this.map.getUnits( this.selectionStart, this.selectionEnd ) ;
	
	 console.log( 'getUnits complete' ) ;
	
	 this.selected.unselect() ;
	
	 this.selected.select( unitsArray ) ;
		
	 this.selectionMode = false ;
	} ;
	
SelectionControl.prototype.abortSelection  = function()
	{
	 this.map.Control.unhighlightTiles( this.selectionStart, this.selectionEnd ) ;
	 
	 this.selectionMode = false ;
	} ;
	


SelectionControl.prototype.mousePressedOnEntity  = function( event, entity )
	{
	 console.log( 'SelectionControl.mousePressedOnEntity( )') ;	
	
	
	 if( !entity || !entity.Control ) return ; // clicking on the skydome or something... d'Oh!
	
	 if( this.selected.mousePressedOnControl( event, entity.Control ) ) return ; // the entity acted on the mousepress on the entity and which aborts further selection behavior
				
		 // the entity did not consume the click, it could either be a 3D button or the user wants to make a new selection
		
	 if( !entity.Control.mousePressed || !entity.Control.mousePressed( event )  )
		if( event.leftIsDown ) // it isn't a button so on a left click enter selection mode
			{
			 this.startSelection( event )  ;
			}
		
	} ;
	

SelectionControl.prototype.mouseMovedOnEntity    = function( event, entity ) 
	{
	 if( this.selectionMode )
		{
		 if( entity && entity.Control )
		 	this.changePreliminarySelection( event ) ;
		
		 return ;
		}
	} ;	
	
	
SelectionControl.prototype.mouseReleasedOnEntity = function( event, entity ) 
	{
	 if( this.selectionMode )
		this.finishSelection( event ) ;
	} ;
	
	
exports.SelectionControl = SelectionControl ;
exports.Selection 		 = Selection ; // is this really necessary?