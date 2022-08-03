
import React, {useState,useEffect} from "react"
import {Row, Card, Col,Button} from "react-bootstrap"
import {GrUserAdmin} from "react-icons/gr"
import {WOQLTable} from '@terminusdb/terminusdb-react-table'
import {getUsersDatabaseLocalListConfig} from "../ViewConfig"
import {AccessControlHook} from "../hooks/AccessControlHook"
import {RoleListModal} from "./RoleList"

export const UserDatabasesListLocal = ({team,selectedUser,accessControlDashboard,options}) => {  

    const [currentRoleToUpdate,setCurrentRoleToUpdate]=useState(null)
    const [show, setShow] = useState(false)
    const roles = accessControlDashboard.getRolesList()

    const selectTeamRow = selectedUser || {}
 
    const {createUserRole,
          getUserDatabasesRoles,
          userDatabaseList,
          updateUserRole,
          loading,
          errorMessage,
          successMessage} =  AccessControlHook(accessControlDashboard)
    
    //to be review the roles list doesn't change
    const resultFormatter=(result)=>{
        if(!Array.isArray(result))return []
        const result01 = result.map(item=>{
            item.role =selectTeamRow.role
            return item
        })

        return result01
    }

    useEffect(() => {
        getUserDatabasesRoles(team,selectTeamRow["@id"],resultFormatter)
    }, [selectTeamRow["@id"]])

   //const orgUserArr = Array.isArray(orgUsers) ? orgUsers : []
   // let rowCount=orgUserArr.length  

    //if not capability I create the role
    const changeUserRoleForScope= (currentSelected)=>{
        setCurrentRoleToUpdate(currentSelected)
        setShow(true)
    }

    const changeUserRole = (role) =>{
        //alert(role)
        if(currentRoleToUpdate.capability){
            updateUserRole(team,currentRoleToUpdate.userid,currentRoleToUpdate.capability,role,currentRoleToUpdate.scope).then(()=>{
                if(!errorMessage){
                    setShow(false)
                } 
            })
        }else{
            createUserRole(team,currentRoleToUpdate.userid,role,currentRoleToUpdate.scope).then(()=>{
                if(!errorMessage){
                    setShow(false)
                }
            })
        }
    }

    
    function getActionDbButtons (cell) {       
        const currentSelected = cell.row.original
        return <div></div>
        return <span className="d-flex">          
            <Button variant="success" size="sm"  title={`change user roles`} onClick={() => changeUserRoleForScope(currentSelected)}>
                <GrUserAdmin/> 
            </Button>
        </span>
    }

    const propsObj = {show, setShow, team:team,loading,
        clickButton:changeUserRole,
        errorMessage,
        successMessage}
    
    
    const parentRole = selectTeamRow ? selectTeamRow.role : null
    const databaseListConfig = getUsersDatabaseLocalListConfig(10,getActionDbButtons)
    
    if(loading){
        return  <Row className="mr-5 ml-2">
                    <Card className="shadow-sm m-4">
                        <div>LOADING .......</div>
                    </Card>
                </Row>
    }

    return <React.Fragment>
                {currentRoleToUpdate && show && 
                    <RoleListModal rolesList={roles} parentRole={parentRole} {...currentRoleToUpdate} {...propsObj}   title={`Change the user role for the ${currentRoleToUpdate.name} ${currentRoleToUpdate.type}`}/>
                }
       
                {Array.isArray(userDatabaseList) && 
                     <Card className="shadow-sm m-4">
                     <Card.Header className=" d-flex justify-content-between bg-transparent">
                        <Col className="d-flex align-item-center">
                            <h6 className="mb-0 mt-1 float-left text-muted">{selectTeamRow.name} Dataproducts Role
                            </h6>
                        </Col>
                     </Card.Header>
                    <Card.Body>                       
                        <WOQLTable
                        result={userDatabaseList}
                        freewidth={true}
                        view={(databaseListConfig ? databaseListConfig.json() : {})}
                        limit={10}
                        start={0}
                        orderBy={""} 
                        loading={loading}
                        totalRows={userDatabaseList.length}/>
                        </Card.Body>
                    </Card>
                }
            </React.Fragment>
}
