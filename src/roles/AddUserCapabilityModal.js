import React, {useState, useRef, useEffect} from "react"
import {Form} from "react-bootstrap"
import {BiError} from "react-icons/bi"
import {AccessControlHook} from "../hooks/AccessControlHook"
import { GET_ALL_USERS } from "../utils/default"
import { RoleListModal } from "./RoleList"

//create user if do not exists and add to team
export const AddUserCapabilityModal = ({showModal, setShowModal, team, teamId, accessControlDashboard,options,updateTable}) => {
    if(!accessControlDashboard) return ""
    const {successMessage,
            manageCapability,
            resultTable, getResultTable,
          loading,
          errorMessage} =  AccessControlHook(accessControlDashboard,options)
    const [error, setError]=useState(false)

    useEffect(() => {
        updateResultTable()
    }, [])

    const updateResultTable = () =>{
        getResultTable(GET_ALL_USERS)
    }

    const userId = useRef(null);
    const password = useRef(null);
    const userName = useRef(null)

    const roles = accessControlDashboard.getRolesList()
//teamId,operation,roles, username,password
    function addUser(role){
        const userId = userName.current.value

        manageCapability(teamId,"grant",role,userId).then(done=>{
            if(done){
                updateTable()
                setShowModal(false)
            }
        })
        //userId.current.value = ""
        //if(!defaultName)password.current.value = ""
        setError(false)                     
        //}
    }

    function handleKeyPress(e) {
        if (e.which === 13 /* Enter */) {
            e.preventDefault()
        }
    }

    const propsObj = {setShow:setShowModal, team:team,
                title:`Add a menber to the team - ${team}`,
                clickButton:addUser}
    //const value =  defaultName ? {value:defaultName, disabled:true} : {}

    return <RoleListModal {...propsObj}
                type="checkbox"
                loading={loading} 
                errorMessage={errorMessage} 
                successMessage={successMessage} 
                show={showModal}
                rolesList={roles}>
            {error && <span className="d-flex">
                <BiError className="text-danger mt-1 mr-1"/><p className="text-danger">Email is mandatory</p>
            </span>}
            <Form onKeyPress={handleKeyPress}>
            <Form.Group className="mb-3">
                <Form.Select ref={userName}>
                    <option>Select The User Name</option>
                    {resultTable && resultTable.map(item=>{
                        return <option value={item["@id"]}>{item.name}</option>
                    })
                    }
                </Form.Select>
            </Form.Group>          
            </Form>
        </RoleListModal>
}

/*
   <Form.Group className="mb-3">
                    <Form.Control
                        ref={userId}
                        {...value}
                        type="text"
                        placeholder="User Id"
                        aria-describedby="inputGroupPrepend"
                        required
                    />
                </Form.Group>
               {!defaultName &&<Form.Group>
                    <Form.Control
                        ref={password}
                        type="password"
                        placeholder="Password"
                        aria-describedby="inputGroupPrepend"
                        required
                    />
                </Form.Group>}*/
