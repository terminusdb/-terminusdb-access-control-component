import React, {useEffect} from "react"
import {Row, Badge, Col, Card,Button} from "react-bootstrap"
import {AccessControlHook} from "../hooks/AccessControlHook"
import {WOQLTable} from '@terminusdb/terminusdb-react-table'
import {getInvitationListConfig} from "../ViewConfig"
import {RiDeleteBin7Line} from "react-icons/ri"
//import {PROGRESS_BAR_COMPONENT} from "../constants"

export const InvitationsList = ({team,setShow,accessControlDashboard}) => {  
    if(!accessControlDashboard)return ""
    const {getOrgInvitations,orgInvitations,loading,deleteInvitation} =  AccessControlHook(accessControlDashboard.accessControl())
    const orgInvitationsArr = Array.isArray(orgInvitations) ? orgInvitations : []
    const invitesCount = orgInvitationsArr.length 
    useEffect(() => {
        getOrgInvitations(team)
    }, [team,setShow])

    const deleteInvitationItem = (invID)=>{
        deleteInvitation(team,invID)
    }

    function getDeleteButton (cell) {
        const invFullId = cell.row.original['@id']
        const invId = invFullId.substr(invFullId.lastIndexOf("/")+1)
        return <span className="d-flex">
            <Button variant="danger" size="sm" className="ml-5" title={`delete - ${invId}`} onClick={() => deleteInvitationItem(invId)}>
                <RiDeleteBin7Line/> 
            </Button>
        </span>
    }
    const tableConfig = getInvitationListConfig(10, getDeleteButton)
    
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
                    <Card className="shadow-sm m-4">loading ......
                        {/**<Loading></Loading>**/}
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
                    <Row key={`member_headers`} className=" mb-5 mt-2">
                        <Col md={6} className="member-headers">
                            Email
                        </Col>
                        <Col md={2} className="member-headers">
                            Status
                        </Col>
                        <Col md={2} className="member-headers">
                        </Col>
                    </Row>
                    <WOQLTable
                        result={orgInvitationsArr}
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