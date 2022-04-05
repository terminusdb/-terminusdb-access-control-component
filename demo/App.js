import React , {useEffect,useState} from 'react';
import TerminusClient from '@terminusdb/terminusdb-client'
import { TeamMembers } from '@terminusdb/terminusdb-access-control-component';
//import {WOQLResult} from "@terminusdb/terminusdb-client";

const App = (props) =>{
    const jwtoken = process.env.JWT 
    const org= process.env.ORG_NAME
    const server = process.env.SERVER_URL
    const userEmail = process.env.USER_EMAIL
    
    const clientAccessControl = new TerminusClient.AccessControl(server,{organization:org,jwt:jwtoken})
    
    return <TeamMembers organization={org} currentUser={userEmail}
            clientAccessControl={clientAccessControl}/>
}
export default App;
