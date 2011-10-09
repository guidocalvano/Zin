var mod = function()
{

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

return Selection ;
} ;

define( [], mod ) ;

