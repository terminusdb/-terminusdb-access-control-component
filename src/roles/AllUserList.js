import React, {useEffect} from "react"
import {Row, Badge, Col, Card,Button} from "react-bootstrap"
import {AccessControlHook} from "../hooks/AccessControlHook"
import {WOQLTable} from '@terminusdb/terminusdb-react-table'
import {getAllUsersListConfig} from "../ViewConfig"
import {RiDeleteBin7Line} from "react-icons/ri"
import {AiOutlineUserAdd} from "react-icons/ai"
import  {formatCell} from "./formatData"
//import {PROGRESS_BAR_COMPONENT} from "../constants"

export const AllUserList = ({setShow,accessControlDashboard,options}) => {  
    if(!accessControlDashboard) return ""

    const {deleteUser,loading,
        getAllUsers,usersList} =  AccessControlHook(accessControlDashboard.accessControl(),options)
    
    const usersListArr = Array.isArray(usersList) ? usersList : []

    // all the system database user
    useEffect(() => {
        getAllUsers()
    }, [])


    function getActionButtons (cell) {
        const invFullId = cell.row.original['@id']
        const name = cell.row.original['name']
        return <React.Fragment><span className="d-flex">
            <Button variant="danger" size="sm" className="ml-5" title={`delete - name`} onClick={() => deleteUser(invFullId)}>
                <RiDeleteBin7Line/> 
            </Button>
            <Button variant="success" size="sm" className="ml-5" title={`add - name`} onClick={() => setShow(invFullId)}>
                <AiOutlineUserAdd/> 
            </Button>
        </span></React.Fragment>
        
    }
    const tableConfig = getAllUsersListConfig(10, getActionButtons)

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
                        <Badge variant="info" className="text-dark ml-3">{ usersListArr.length}</Badge>
                    </h6>

                </Card.Header>
                <Card.Body>
                    <WOQLTable
                        result={usersList}
                        freewidth={true}
                        view={(tableConfig ? tableConfig.json() : {})}
                        limit={10}
                        start={0}
                        orderBy={""} 
                        loading={loading}
                        totalRows={ usersListArr.length}
                    />
                </Card.Body>
            </Card>
        </Row>
    </React.Fragment>
}