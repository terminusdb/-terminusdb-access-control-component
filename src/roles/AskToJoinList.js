import React, {useEffect} from "react"
import {Row, Badge, Col, Card,Button} from "react-bootstrap"
import {AccessControlHook} from "../hooks/AccessControlHook"
import {WOQLTable} from '@terminusdb/terminusdb-react-table'
import {getAskAccessListConfig} from "../ViewConfig"
import {RiDeleteBin7Line} from "react-icons/ri"
import {AiOutlineUserAdd} from "react-icons/ai"
//import {PROGRESS_BAR_COMPONENT} from "../constants"

export const AskToJoinList = ({team,setShow,accessControlDashboard,options}) => {  
    if(!accessControlDashboard) return ""
    const {deleteTeamRequestAccess,loading,
        getTeamRequestAccessList,teamRequestAccessList} =  AccessControlHook(accessControlDashboard,options)
    
    const teamRequestAccessListArr = Array.isArray(teamRequestAccessList) ? teamRequestAccessList : []
    const invitesCount = teamRequestAccessListArr.length 
    
    useEffect(() => {
        getTeamRequestAccessList(team)
    }, [team])


    function getDeleteButton (cell) {
        const invFullId = cell.row.original['@id']
        const invId = invFullId.substr(invFullId.lastIndexOf("/")+1)
        const email = cell.row.original['email']
        return <React.Fragment><span className="d-flex">
            <Button variant="danger" size="sm" className="ml-5" title={`delete - ${email}`} onClick={() => deleteTeamRequestAccess(invId)}>
                <RiDeleteBin7Line/> 
            </Button>
            <Button variant="success" size="sm" className="ml-5" title={`add - ${email}`} onClick={() => setShow(email)}>
                <AiOutlineUserAdd/> 
            </Button>
        </span></React.Fragment>
        
    }
    const tableConfig = getAskAccessListConfig(10, getDeleteButton)

    if(loading){
        return  <Row className="mr-5 ml-2">
                    <Card className="shadow-sm m-4">
                        <div>LOADING .......</div>
                    </Card>
                </Row>
    }
    

    return <React.Fragment>
        <Row className="mr-5 ml-2">
            <Card className="shadow-sm m-4">
                <Card.Header className=" d-flex justify-content-between bg-transparent">
                    <h6 className="mb-0 mt-1 float-left w-100 text-muted">Total Members
                        <Badge variant="info" className="text-dark ml-3">{invitesCount}</Badge>
                    </h6>

                </Card.Header>
                <Card.Body>
                    <WOQLTable
                        result={teamRequestAccessList}
                        freewidth={true}
                        view={(tableConfig ? tableConfig.json() : {})}
                        limit={10}
                        start={0}
                        orderBy={""} 
                        loading={loading}
                        totalRows={invitesCount}
                    />
                </Card.Body>
            </Card>
        </Row>
    </React.Fragment>
}