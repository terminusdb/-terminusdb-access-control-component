import React , { useState } from "react"
import {UTILS} from "@terminusdb/terminusdb-client"

export const AccessControlHook=(accessControlDashboard,options)=> {
    //to load the items list
    const [loading,setLoading]=useState(null)
    const [errorMessage,setError] =useState(false)
    const [successMessage,setSuccessMessage] =useState(null)
 
    const [orgUsers,setOrgUsers]=useState([])
    const [orgInvitations,setOrgInvitations]=useState([])
    
    //const [invitationSent,setInvitationSent] =useState(null)
    const [userDatabaseList,setUserDatabaseList]=useState(null)
    const [teamRequestAccessList,setTeamRequestAccessList] =useState([])
    
    //review
    const [rolesList,setRolesList]=useState(accessControlDashboard.getRolesList())
    const [resultTable,setResultTable]=useState([])

    const formatMessage = (err)=>{
        let message = err.message
        if(err.data && err.data["api:message"]){
            message = err.data["api:message"]
        }
        return message
    }

    const clientAccessControl = accessControlDashboard.accessControl()
    const resetInvitation = ()=>{
        setLoading(false)
        setError(false)
        setSuccessMessage(false)
    }

    async function sendInvitation(orgName,emailTo,role){
        const errorMessage = options.hookMessage.sendInvitation.error
        const successMessage = options.hookMessage.sendInvitation.success   
        setLoading(true)
        setError(false) 
        setSuccessMessage(false)
        try{
            await clientAccessControl.sendOrgInvite(emailTo, role, "",orgName)
            setSuccessMessage(successMessage)
            getOrgUsers()
        }catch(err){
            setError(errorMessage)
        }finally{          
            setLoading(false)
        }
        
    }

    /*
    * I can not use the general one because I need in accessControl
    */
    async function getRolesList(){
        setLoading(true)
        setError(false) 
        setSuccessMessage(false)
        const errorMessage = "I can not get the roles list"
        try{
            const result = await accessControlDashboard.callGetRolesList()
            setRolesList (result.reverse())
            if(successMessage)setSuccessMessage(successMessage)
        }catch(err){
            setError(errorMessage)
        }finally{          
            setLoading(false)
        }
    }


    async function createUserRole(orgName,userid,role,scope){
        setLoading(true)
        setError(false) 
        setSuccessMessage(false)
        const errorMessage = "I can not create the role"
        try{
            await clientAccessControl.createUserRole(userid, scope, role, orgName)
            await getUserDatabasesRoles(orgName,userid)
            if(successMessage)setSuccessMessage(successMessage)
        }catch(err){
            setError(formatMessage(err))
        }finally{          
            setLoading(false)
        }
    }
    
    async function updateUserRole(orgName,userid,capid,role,scope){
        setLoading(true)
        setError(false)
        setSuccessMessage(false)
        try{
            await clientAccessControl.updateUserRole(userid, capid, scope, role, orgName)
            if(typeof scope === "string" && scope.indexOf("Organization")> -1){
                await getOrgUsers(orgName)
            }
            await getUserDatabasesRoles(orgName,userid)
            if(successMessage)setSuccessMessage("The role has been update")
        }catch(err){
            setError("I can not update the role")
        }finally{                       
            setLoading(false)
        }
    }

    //I can move this in the main context I don't need to call it every time
    //it get the list of roles document

    async function getUserDatabasesRoles(orgName,userid,resultFormatter){
        setLoading(true)
		try{
		    let response = await clientAccessControl.getDatabaseRolesOfUser(userid,orgName)
            if(resultFormatter){
                response = resultFormatter(response)
            }
			setUserDatabaseList(response)
            return response
		}catch(err){
			setError('I can not add the user to the team')
		}finally{
        	setLoading(false)
        }

    } 
     //%3D%25team
    async function getOrgUsers(orgName,resetUserDatabases=false){
        setLoading(true)
		try{
			const response = await clientAccessControl.getOrgUsers(orgName)
            if(resetUserDatabases)setUserDatabaseList(null)
			setOrgUsers(response)         
            return response
		}catch(err){
            console.log(err.message)
			setError('I can not get the user list')
		}finally{
        	setLoading(false)
        }

    }
    
    function filterCapability (capArr,orgId){
        let role;
        let databases= {}
        capArr.forEach(cap => {
            if(cap.scope === orgId){
                role = cap.role
            }else if(cap.scope.startsWith("UserDatabase")){
                databases[cap.scope] = cap.role
            }

        })

        return {role,databases}
    }

    async function getOrgUsersLocal(orgName,resetUserDatabases=false){
        setLoading(true)
		try{
            const orgId= `Organization/${UTILS.encodeURISegment(orgName)}`
			const response = await clientAccessControl.getOrgUsers(orgName)
            const responseFormatted = []
            response.forEach(element => {
                const {role , databases} = filterCapability(element["capability"],orgId)
                const item = {"@id":element["@id"],
                              "username":element["name"],
                              role,databases,scope:orgId}
                responseFormatted.push(item)
            });

            if(resetUserDatabases)setUserDatabaseList(null)
			setOrgUsers(responseFormatted)         
            return response
		}catch(err){
            console.log(err.message)
			setError('I can not get the user list')
		}finally{
        	setLoading(false)
        }
    }


    async function sendTeamAccessRequest(orgName,email,affiliation,note){
        const errorMessage = "I can not send the invitation"
        const successMessage = "The invitation has been sent"
     
        setLoading(true)
        setError(false) 
        setSuccessMessage(false)
        try{
            await clientAccessControl.sendAccessRequest(email,affiliation,note,orgName)
            if(successMessage)setSuccessMessage(successMessage)
        }catch(err){
            setError(errorMessage)
        }finally{           
            setLoading(false)
        }
        
    }

    async function getTeamRequestAccessList(orgName){
        setLoading(true)
		try{
			const response = await clientAccessControl.accessRequestsList(orgName)
            setTeamRequestAccessList(response)         
            return response
		}catch(err){
            console.log(err.message)
			setError('I can not get the invitation request list')
		}finally{
        	setLoading(false)
        }

    }
    async function deleteTeamRequestAccess(accId,orgName){
        setLoading(true)
		try{
            await clientAccessControl.deleteAccessRequest(accId,orgName)
			getTeamRequestAccessList(orgName)         
            return response
		}catch(err){
			setError('I can not delete the access list')
		}finally{
        	setLoading(false)
        }

    }

    async function getOrgInvitations(orgName){
        setLoading(true)
		try{
			const response = await clientAccessControl.getPendingOrgInvites(orgName) //await axiosHub.get(`${baseUrl}/organizations/${orgid}/invites`, options)
			setOrgInvitations(response)
		}catch(err){
			setError('I can not add the user to the team')
		}finally{
        	setLoading(false)
        }

    }

    async function deleteInvitation(orgName,invid){
        setLoading(true)
		try{
            await clientAccessControl.deleteOrgInvite(invid,orgName)
			getOrgInvitations(orgName)
		}catch(err){
           setError(formatMessage(err))
		}finally{
        	setLoading(false)
        }
    }

    async function deleteUserFromOrganization(orgName,userid){
        setLoading(true)
		try{
			await clientAccessControl.removeUserFromOrg(userid,orgName)
            getOrgUsers(orgName)
		}catch(err){
            setError(formatMessage(err))
		}finally{
        	setLoading(false)
        }
    }

    async function createRole(name,actions){
        setLoading(true)
        setError(false)
		try{
			await clientAccessControl.createRole(name,actions)
            return true
		}catch(err){    
			setError(formatMessage(err))
            return false           
		}finally{
        	setLoading(false)
        }
    }

    /*
    * local database
    */
    async function manageCapability(teamId,operation,roles, username,password){
        setLoading(true)
		try{
			//const user = await clientAccessControl.addUser(name,password)
            const rolesIds = roles.map(item =>{
                if(typeof item === "object"){
                    return item["@id"]
                }
                else return item
            })
            await clientAccessControl.manageCapability(username, teamId, rolesIds, operation)
            return true
		}catch(err){
        	setError(formatMessage(err))
            return false
		}finally{
        	setLoading(false)
        }
    }

    /*
    * return all table reuslt list by type
    * I use the filter function to format or remove item from the result
    */
     async function getResultTable(methodName,filterFunction){
        setLoading(true)
		try{
			let result = await clientAccessControl[methodName]()
            if(filterFunction){
                result = filterFunction(result)
            }
            setResultTable(result.reverse())
        }catch(err){
			setError(formatMessage(err))
		}finally{
        	setLoading(false)
        }
    }


    /*
    * delete an document by name
    * the methodName point at the differnt function in accessControl class
    */
    async function deleteElementByName(methodName,name){
        setLoading(true)
        setError(false)
        setSuccessMessage(false)
		try{
			await clientAccessControl[methodName](name)
            return true
		}catch(err){
			setError(formatMessage(err))
            return false
		}finally{
        	setLoading(false)
        }
    }

    /*
    * create a new document
    */
    async function createElementByName(methodName,name,extraParam){
        setLoading(true)
        setError(false)
        setSuccessMessage(false)
		try{
			await clientAccessControl[methodName](name,extraParam)
            return true
		}catch(err){
            setError(formatMessage(err))
            return false
		}finally{
        	setLoading(false)
        }
    }
    
    return {getOrgUsersLocal,
            createElementByName,
            deleteElementByName,
            getResultTable,
            resultTable,
            setError,
            getRolesList,
            rolesList,
            createRole,
            manageCapability,
            teamRequestAccessList,
            sendTeamAccessRequest,
            deleteTeamRequestAccess,
            getTeamRequestAccessList,
            successMessage,
            loading,
            createUserRole,
            updateUserRole,
            getUserDatabasesRoles,
            userDatabaseList,
            deleteUserFromOrganization,
            deleteInvitation,
            resetInvitation,
            orgInvitations,
            orgUsers,
            //invitationSent,
            getOrgUsers,
            getOrgInvitations,
            sendInvitation,
            errorMessage}

}

