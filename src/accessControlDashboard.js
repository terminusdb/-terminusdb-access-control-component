//every component 
export const AccessControlDashboard = (clientAccessControl)=>{

    let __rolesList = []
    let __teamUserRole = null
    let __teamUserActions = null
    let __userDBRoles = null
    let __dbUserActions = null
    let __clientAccessControl = clientAccessControl
    //let __currentUser = 

    async function callGetRolesList(){
            try{
               const list = await __clientAccessControl.getAccessRoles()
               __rolesList= list
            }catch(err){
                console.log('I can not get the role list')
            }
    }
    //this is will be a different call 
    async function callGetUserTeamRole(orgName,userEmail){
		try{
			const teamRole = await __clientAccessControl.getTeamUserRole(orgName)
            setTeamActions(teamRole.userRole)
		}catch(err){
			console.log(err.message)
		}

    }

    function accessControl(){
        return __clientAccessControl
    }
    
    const formatActionsRoles = (role)=> {
        if(!Array.isArray(__rolesList)) return {}
        const actions = __rolesList.find(element => element["@id"] === role);
        if(actions && Array.isArray(actions['action'])){
            return actions['action'].reduce(function(object, value) {
                object[value] = value;
                return object;
            }, {});
        }
        return {}
    }

    const setTeamActions = (teamRole,dbUserRole) =>{
       // const database = databaseRoles.find(element => element["name"]["@value"] === dataproduct);
        //const role = database ? database['role'] : teamRole
        __teamUserRole = teamRole
        __teamUserActions =  formatActionsRoles(teamRole) 
        __userDBRoles = dbUserRole
        //if change the team I reset the __dbUserActions === at the teamActions
        __dbUserActions = null
    }

    const setDBUserActions = (id) =>{
        if(!id) {
            __dbUserActions = null
            return
        }
        if(!Array.isArray(__userDBRoles)) return 
        const database = __userDBRoles.find(element => element["name"]["@value"] === id);
        const role = database ? database['role'] : null
        //no role could be a new database
        if(!role || role === __teamUserRole){
            __dbUserActions = __teamUserActions         
        }else{
            __dbUserActions = formatActionsRoles(role)
        }     
    }

    const isAdmin = () =>{
        return __teamUserRole && __teamUserRole.indexOf("admin")> -1 ? true : false
    }

    const createDB = () =>{
       if(!__teamUserActions)return false 
       return __teamUserActions[CREATE_DATABASE] ? true : false
    }

    const deleteDB = () =>{
        if(!__teamUserActions)return false 
        return __teamUserActions[DELETE_DATABASE] ? true : false
     }

    const schemaWrite = () =>{
     if(!__teamUserActions)return false 
       return __teamUserActions[SCHEMA_WRITE_ACCESS] ? true : false
    }

    const classFrame = () =>{
        if(!__teamUserActions)return false 
          return __teamUserActions[CLASS_FRAME] ? true : false
    }

    const instanceRead = () =>{
        if(!__teamUserActions)return false 
          return __teamUserActions[INSTANCE_READ_ACCESS] ? true : false
    }

    const instanceWrite = () =>{
        if(!__teamUserActions)return false 
          return __teamUserActions[INSTANCE_WRITE_ACCESS] ? true : false
    }

    const branch = () =>{
        if(!__teamUserActions)return false 
          return __teamUserActions[BRANCH] ? true : false
    }

    const getRolesList = () =>{
        return __rolesList
    }

    const getTeamUserRole = () =>{
        return __teamUserRole
    }


    return {createDB,
            classFrame,
            instanceRead,
            instanceWrite,
            branch,
            schemaWrite,
            isAdmin,
            setTeamActions,
            callGetUserTeamRole,
            setDBUserActions,
            getTeamUserRole,
            getRolesList,
            deleteDB,
            accessControl,
            callGetRolesList}

}

export const BRANCH="branch"
export const CLASS_FRAME = "class_frame" 
export const CLONE= "clone"
export const COMMIT_READ_ACCESS = "commit_read_access"
export const COMMIT_WRITE_ACCESS = "commit_write_access"
export const CREATE_DATABASE= "create_database"
export const DELETE_DATABASE= "delete_database"
export const FETCH = "fetch"
export const INSTANCE_READ_ACCESS = "instance_read_access"
export const INSTANCE_WRITE_ACCESS =  "instance_write_access"
export const MANAGE_CAPABILITIES = "manage_capabilities"
export const META_READ_ACCESS =  "meta_read_access"
export const META_WRITE_ACCESS =  "meta_write_access"
export const PUSH = "push"
export const REBASE =  "rebase"
export const SCHEMA_READ_ACCESS = "schema_read_access"
export const SCHEMA_WRITE_ACCESS = "schema_write_access" 