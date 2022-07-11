export const defaultSetting ={
    labels:{
        userListTitle:"Team Members",
        inviteAddText: "Here you can invite people to your team",
        inviteMember:"Invite a Member",
        addUser:"Add a user to the team",
        addRole:"Add Role",
        createRole: "Create a new Role"
    },
    tabs:{
        MEMBERS_TAB:true,
        INVITATION_TAB:false,
        REQUEST_ACCESS:false,
        ALL_USER:true
    },
    buttons:{
        ADD_USER:true,
        ADD_INVITATION:false,
        ADD_ROLE:true,
       
    },
    hookMessage:{
        sendInvitation:{
            error: "I can not send the invitation",
            success:"The invitation has been sent"
        }
    },
    interface:{
        memberList:{
            delete:true,
            changeRole:true,
            showDatabase:true,
        }
    }
}

//Role/infoReader