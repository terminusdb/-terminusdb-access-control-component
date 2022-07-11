import React, {useEffect} from "react"
import {Row, Badge, Col, Card,Button} from "react-bootstrap"
import {AccessControlHook} from "../hooks/AccessControlHook"
import {WOQLTable} from '@terminusdb/terminusdb-react-table'
import {getAskAccessListConfig} from "../ViewConfig"
import {RiDeleteBin7Line} from "react-icons/ri"
import {AiOutlineUserAdd} from "react-icons/ai"
import  {formatCell} from "./formatData"
//import {PROGRESS_BAR_COMPONENT} from "../constants"

export const AskToJoinList = ({team,setShow,accessControlDashboard,options}) => {  
    if(!accessControlDashboard) return ""
    const {deleteTeamRequestAccess,loading,
        getTeamRequestAccessList,teamRequestAccessList} =  AccessControlHook(accessControlDashboard.accessControl(),options)
    
    const teamRequestAccessListArr = Array.isArray(teamRequestAccessList) ? teamRequestAccessList : []
    const invitesCount = teamRequestAccessListArr.length 

    useEffect(() => {
        getTeamRequestAccessList(team)
    }, [team])

    const deleteInvitationItem = (invID)=>{
        deleteInvitation(team,invID)
    }

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
    
    const InvitationList = ({searchInvitation}) => {
        let invites=[]
        orgInvitationsArr.map((item)=> {

            if(searchInvitation && (!item.email.toUpperCase().includes(searchInvitation.toUpperCase()))) {
                return false
            }
            var color

            const invFullId =  item['@id']
            const invId = invFullId.substr(invFullId.lastIndexOf("/")+1)
            //"Organization/collar_team/invitations/Invitation/b1dc905a8e64371c37c11db84d30790a42c0ab1b097abf3b16fca81a2c2c54e4"
            if(item.status == "pending") color="warning"
            else if (item.status == "rejected") color="danger"
            else if (item.status == "inactive") color="muted"

            invites.push(<Row key={`member_${invId}`} className="mb-3">
                <Col md={6} className="d-flex">
                    {item.email_to}
                </Col>
                <Col md={4}>
                    <span className={`text-${color}`}>
                        {item.status}
                    </span>
                </Col>
                <Col md={2}>
                    <button id={invId}  onClick={deleteInvitationItem} className="tdb__button__base tdb__panel__button tdb__panel__button--red fas fa-trash-alt"></button>                   
                </Col>
            </Row>)
        })
        return invites
    }

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