var mod = function( ex, UnitControl )
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
			 ex.getEmbedded( nextUnit, UnitControl.prototype ).select() ;
			}
		}
		
	}
	
Selection.prototype.unselect = function()
	{
	 for( var unit in this.selectedUnitsArray )
	 	ex.getEmbedded( this.selectedUnitsArray[ unit ], UnitControl.prototype ).unselect() ;
	
	 this.selectedUnitsArray = [] ;
	} ;



Selection.prototype.mouseMovedOnControl    	= function( event, control ) 
	{
	 for( var unit in this.selectedUnitsArray )
	 	ex.getEmbedded( this.selectedUnitsArray[ unit ], UnitControl.prototype ).mouseMovedOnControl( event, control ) ;
	} ;


Selection.prototype.mousePressedOnControl 	 = function( event, control )
	{
	 for( var unit in this.selectedUnitsArray )
	 	ex.getEmbedded( this.selectedUnitsArray[ unit ], UnitControl.prototype ).mousePressedOnControl( event, control ) ;		
	} ;


Selection.prototype.mouseReleasedOnControl   = function( event, control ) 
	{
	 for( var unit in this.selectedUnitsArray )
	 	ex.getEmbedded( this.selectedUnitsArray[ unit ], UnitControl.prototype ).mouseReleasedOnControl( event, control ) ;
	} ;

return Selection ;
} ;

define( [ 'extend', './UnitControl.js' ], mod ) ;

