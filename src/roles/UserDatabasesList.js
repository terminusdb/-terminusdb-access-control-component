
import React, {useState,useEffect} from "react"
import {Row, Card, Col,Button} from "react-bootstrap"
import {GrUserAdmin} from "react-icons/gr"
import {WOQLTable} from '@terminusdb/terminusdb-react-table'
import {getUsersDatabaseListConfig} from "../ViewConfig"
import {AccessControlHook} from "../hooks/AccessControlHook"
import {RoleListModal} from "./RoleList"
import {formatCell} from "./formatData"

export const UserDatabasesList = ({team,selectedUser,accessControlDashboard,options}) => {  
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
    useEffect(() => {
        getUserDatabasesRoles(team,selectTeamRow.userid)
    }, [selectTeamRow.userid])

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
        const currentSelected = formatCell(cell,"DATAPRODUCT")
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
    const databaseListConfig = getUsersDatabaseListConfig(10,getActionDbButtons)
    
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
                         {selectTeamRow && <Col className="d-flex align-item-center">
                            <img src={selectTeamRow.picture} 
                                alt={"Profile"}
                                className="nav__main__profile__img mr-4"
                                width="50"/> <h6 className="mb-0 mt-1 float-left text-muted">{selectTeamRow.email} Dataproducts Role
                            </h6></Col>}
     
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
