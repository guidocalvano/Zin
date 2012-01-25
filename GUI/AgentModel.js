
var mod = function( Agent )
    {
     function AgentModel() {} 
     
     
     AgentModel.prototype = new Agent() ;
    
    
     return AgentModel ;
    } ;
    
    
define( [ '../AI/Agent.js' ], mod ) ;