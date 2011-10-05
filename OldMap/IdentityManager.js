

function IdentityArchive()
	{
	 this.objectById = new Object() ;
	}


IdentityArchive.prototype.addObject = function( object )
	{

	 this.objectById[ object.IdentityManager.id ] = object ; 

	} ;


IdentityArchive.prototype.removeObject = function( object  )
	{
	 delete this.objectById[ object.IdentityManager.id ] ;
	} ;

IdentityArchive.prototype.getObject = function( id )
	{
	 return this.objectById[ id ] ;
	} ;


function IdentityManager()
	{
	 this.nextId = 0 ;

	 this.objectById = new Object() ;
	}


IdentityManager.prototype.addObject = function( object )
	{
	 object.IdentityManager.id = this.nextId ;

	 this.objectById[ this.nextId ] = object ; 

	 this.nextId++ ;
	} ;


IdentityManager.prototype.removeObject = function( object  )
	{
	 delete this.objectById[ object.IdentityManager.id ] ;
	} ;

IdentityManager.prototype.getObject = function( id )
	{
	 return this.objectById[ id ] ;
	} ;


