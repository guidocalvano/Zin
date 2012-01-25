
var mod = function( extend, DomainElementShadow, Agent, Control, Tile, TileControl ) 
{
var after 			 = extend.after  ;
var before 			 = extend.before ;
var setEmbedded 	 = extend.setEmbedded ;
var getEmbedded 	 = extend.getEmbedded ;
var key				 = extend.key 		  ;

function UnitControl() {} 

UnitControl.prototype = new Control() ;

UnitControl.prototype.init = function( unit, parent )
	{
	 this.unit = unit ;
	
	 this.node = ( new ogre.SceneNode() ).init() ;
	
	 this.node.setParent( parent ) ;
		
	 this.entity = ( new ogre.Entity() ).init( 'unitMeshCombined.mesh' ) ;	
	
	 this.entity.setParent( this.node ) ;
	
	 // this.entity.Control = this ;
	
	 // this.unit.Control = this ;
	
	 setEmbedded( this.entity, Control.prototype, this ) ;
	
	 setEmbedded( this.unit,   Control.prototype, this ) ;
	
	 this.move( unit.x, unit.y ) ;
	
	 after( unit, "move", this, "move" ) ;
	
	 return this ;
	}


UnitControl.prototype.mousePressedOnControl = function( event, control )
	{		
	 if( control instanceof TileControl ) 
		{
		/*
		 console.log( 'embedded' ) ;
	//	 for( var e in this.unit.____embedded ) console.log( e + ': ' + this.unit.____embedded[ e ] ) ;
		
		 console.log( 'embedded agent data' ) ;
		 console.log( 'Agent key ' + Agent.prototype.____key ) ;

		 for( var p in this.unit.____embedded[ Agent.prototype.____key ] ) console.log( p + ': ' + this.unit.____embedded[ Agent.prototype.____key ][ p ] ) ;		 
		
		 for( var e in this.unit.____embedded ) console.log( e + ': ' + this.unit.____embedded[ e ] ) ;		 
		
		 console.log( 'other stuff' ) ;
		// for( var i in this.unit ) 			console.log( i + ': ' + this.unit[ i ] ) ;
		 // for( var j in this.unit.____key ) 	console.log( j + ': ' + this.unit.____key[ i ] ) ;

		*/	
		 var agent 			= getEmbedded( this.unit, Agent.prototype ) ;
		
	//	 console.log( 'agent: ' ) ;
		 
	//	 for( var i in agent ) console.log( i + ': ' + agent[ i ] ) ;
		
		 console.log( 'key ' + key( DomainElementShadow.prototype ) ) ;
		
		 var domainShadow 	= getEmbedded( agent, DomainElementShadow.prototype ) ;

		 console.log( 'domainShadow key: ' + key( DomainElementShadow.prototype ) )  ;

		
		 console.log( 'domainShadow: ' ) ;
		 
		 for( var j in domainShadow ) console.log( j + ': ' + domainShadow[ j ] ) ;
		
		 console.log( 'embedded' ) ;
		
		 for( var e in agent.____embedded ) console.log( e + ': ' + agent.____embedded[ e ] ) ;
		
		 domainShadow.executeRemote( 'moveTo', [ control.tile.xTile * Tile.prototype.WIDTH_UNITS, control.tile.yTile * Tile.prototype.HEIGHT_UNITS ] ) ;
		} ;
		
	} ;

	
UnitControl.prototype.move = function( newX, newY )
	{
	
	 var o = this.node.convertLocal3NToParentV( 0, 0, 0 )  ;	

	 var heading = this.node.convertParent3NToLocalV( newX, newY, 0 ) ;
	
		
	 var newPosParentV = [ newX, newY, 0  ] ;
	
	 var newPosLocalV  = this.node.convertParent3NToLocalV.apply( this.node, newPosParentV ) ;
	
	 newPosLocalV[ 2 ] = 0 ;
	
	 this.node.moveL3N.apply( this.node, newPosLocalV ) ;	


	 if( heading[ 0 ] == 0 && heading[ 1 ] == 0 ) return ;
	
	 var controlYaw = Math.atan2( -heading[ 0 ], heading[ 1 ] ) ;
	

	
	 this.node.roll( controlYaw ) ; // because the z axis points upward rather than forward, and the y axis
												// points forward in its stead, roll must be called. Yaw is clearer 
												// about what is happening so it is used throughout the rest of the code.
	} ;





UnitControl.prototype.select = function()
	{
	 if( !this.selectEntity )
		{
	 	 this.selectEntity = ( new ogre.Entity() ).init( 'unitMeshCombinedSelect.mesh' ) ; 
	 	 this.selectEntity.Control = this ;
		}

	 this.selectEntity.setParent( this.node ) ;
	
	 console.log( "unit selected" ) ;
	} ;



UnitControl.prototype.unselect = function()
	{
	 this.selectEntity.setParent( null ) ;
	} ;

return UnitControl ;

} ;
define( [ 'extend', '../Communication/DomainElementShadow.js', '../AI/Agent.js', './Control.js', '../Game/Tile', './TileControl.js' ], mod ) ;