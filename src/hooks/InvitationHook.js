import React , { useState } from "react"
export const InvitationHook=(clientAccessControl,options)=> {
	const [loading,setLoading]=useState(null)
    const [orgUsers,setOrgUsers]=useState([])
    const [orgInvitations,setOrgInvitations]=useState([])
    const [errorMessage,setError] =useState(null)
    //const [invitationSent,setInvitationSent] =useState(null)
    const [userDatabaseList,setUserDatabaseList]=useState(null)
    const [successMessage,setSuccessMessage] =useState(null)
    const [teamRequestAccessList,setTeamRequestAccessList] =useState([])
    

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

    async function createUserRole(orgName,userid,role,scope){
        setLoading(true)
        setError(false) 
        setSuccessMessage(false)
        const errorMessage = "I can not create the role"
        try{
            await clientAccessControl.createUserRole(userId, scope, role, orgName)
            await getUserDatabasesRoles(orgid,userid)
            if(successMessage)setSuccessMessage(successMessage)
        }catch(err){
            setError(errorMessage)
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

    async function getUserDatabasesRoles(orgName,userid){
        setLoading(true)
		try{
		    const response = await clientAccessControl.getDatabaseRolesOfUser(userid,orgName)
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

    async function sendTeamAccessRequest(orgName,email,affiliation,note){
        const errorMessage = "I can not send the invitation"
        const successMessage = "The invitation has been sent"
     
        setLoading(true)
        setError(false) 
        setSuccessMessage(false)
        try{
            await clientAccessControl.sendAccessRequest(email,affiliation,note,orgName)
        }catch(err){
            setError(errorMessage)
        }finally{
            if(successMessage)setSuccessMessage(successMessage)
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
            console.log(err.message)
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
            const data = err.response
			setError(data.err)
		}finally{
        	setLoading(false)
        }

    }

    async function deleteUser(orgName,userid){
        setLoading(true)
		try{
			await clientAccessControl.removeUserFromOrg(userid,orgName)
         	getOrgUsers(orgid)
		}catch(err){
            const data = err.response.data
			setError(data.err)
		}finally{
        	setLoading(false)
        }

    }
    
    return {
            //setEmail,
            //email,
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
            deleteUser,
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
