import TerminusClient from '@terminusdb/terminusdb-client'

export const getInvitationListConfig = (limit,getDeleteButton) => {
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("email_to", "status", "delete invitation")
    tabConfig.column("email_to").header("email")
    tabConfig.column("status").header("status")
    tabConfig.column("delete invitation").header(" ")
    tabConfig.column("delete invitation").render(getDeleteButton)
    tabConfig.pager("local")
    tabConfig.pagesize(limit)
    return tabConfig
}

export const getAskAccessListConfig = (limit,getDeleteButton) => {
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("email", "affiliation","note" ,"status", "delete invitation")
    tabConfig.column("email").header("email")
    tabConfig.column("note").header("note")
    tabConfig.column("affiliation").header("affiliation")
    tabConfig.column("status").header("status")
    tabConfig.column("delete invitation").header(" ")
    tabConfig.column("delete invitation").render(getDeleteButton)
    tabConfig.pager("local")
    tabConfig.pagesize(limit)
    return tabConfig
}


export const getUsersListConfig = (limit,getActionButtons,getPicture) => {
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("picture", "email", "role","actions")
    tabConfig.column("user")
    tabConfig.column("picture").header(" ")
    tabConfig.column("email")
    tabConfig.column("role")
    tabConfig.column("actions")
    tabConfig.column("picture").render(getPicture)
    tabConfig.column("actions").render(getActionButtons)
    
    tabConfig.pager("local")
    tabConfig.pagesize(limit)
    return tabConfig
}

export const getUsersDatabaseListConfig = (limit,getActionButtons) => {
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("name", "role","Action")
    tabConfig.column("capability")
    tabConfig.column("name")
    tabConfig.column("role").header("role")
    tabConfig.column("Action").header("")

    tabConfig.column("Action").render(getActionButtons)
    tabConfig.pager("local")
    tabConfig.pagesize(limit)
    return tabConfig
}











