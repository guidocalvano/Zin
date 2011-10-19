
var mod = function( ex )
{

function Agent() {} 

ex.key( Agent.prototype ) ;

Agent.prototype.init = function( unit )
	{
	 // unit.Agent = this ;
	
	 ex.setEmbedded( unit, Agent.prototype, this ) ;
	
	 this.unit = unit ;
	
	 var self = this ;
	 console.log( 'AGENT.init' ) ;
	
	 // setInterval( function(){ var x = Math.random() * self.unit.map.boundX ; var y = Math.random() * self.unit.map.boundY ; self.moveTo( x, y ) ; console.log( 'to x y ' + x + ' ' + y ) ; }, 4000 ) ;
		
	 return this ;
	} ;
	
	
Agent.prototype.moveTo = function( tx, ty )
	{
	 var oldTime = Date.now() ;
	 var newTime = oldTime 	  ;
	 var dT ;
	
	 var self = this ;
	
	 var diff = function( ax, ay, bx, by )
		{
		 return { x: bx - ax, y: by - ay } ;
		
		} ;
	
	 var normDiff = function( ax, ay, bx, by )
		{
		 var d = diff(  ax, ay, bx, by ) ;
		
		 var len = Math.sqrt( d.x * d.x + d.y * d.y ) ;
		
		 return { x: d.x / len, y: d.y/ len } ;
		} ;
	
	 clearInterval( this.moveProcess ) ;
	
	 this.moveProcess = setInterval( 
		function() 
			{
			 oldTime = newTime ;
			 newTime = Date.now() ;
			 
			 dT = newTime - oldTime ;
			 
			 var v = normDiff( self.unit.x, self.unit.y, tx, ty ) ;
			
			 var d = diff( self.unit.x, self.unit.y, tx, ty ) ;
			
			 var d2 = d.x * d.x + d.y * d.y ;
			
			 v.x = v.x * dT / 1000 ;
			 v.y = v.y * dT / 1000 ;
			
			 self.unit.move( self.unit.x + v.x, self.unit.y + v.y ) ;
			
			 if( d2 < ( v.x * v.x + v.y * v.y ) )
				clearInterval( self.moveProcess ) ;
			},
		20
		) ;
	} ;

return Agent ;
} ;
define( [ 'extend' ], mod ) ;