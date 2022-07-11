import React, {useState, useRef, useEffect} from "react"
import {Form} from "react-bootstrap"
import {BiError} from "react-icons/bi"
import {AccessControlHook} from "../hooks/AccessControlHook"

import { RoleListModal } from "./RoleList"

//create user if do not exists and add to team
export const AddUserModal = ({show, setShow, team, accessControlDashboard,options,defaultName}) => {
    if(!accessControlDashboard) return ""
    const {sendInvitation,
          successMessage,
          loading,
          resetInvitation,
          errorMessage} =  AccessControlHook(accessControlDashboard.accessControl(),options)
    const [error, setError]=useState(false)

    const userId = useRef(null);
    const password = useRef(null);
    const roles = accessControlDashboard.getRolesList()

    async function addUser(role){
        const email = emailInput.current.value
        //alert(email)
        if(!email || email === "") {
            setError(true)
            return
        }else{
           // await sendInvitation(team,email,role)
            userId.current.value = ""
            password.current.value = ""
            setError(false)
                       
        }
    }

    function handleKeyPress(e) {
        if (e.which === 13 /* Enter */) {
            e.preventDefault()
        }
    }

    const propsObj = {setShow, team:team,
                title:`Add a menber to the team - ${team}`,
                clickButton:addUser}
    const value =  defaultName ? {value:defaultName, disabled:true} : {}

    return <RoleListModal {...propsObj} 
                loading={loading} 
                errorMessage={errorMessage} 
                successMessage={successMessage} 
                show={show}
                rolesList={roles}>
            {error && <span className="d-flex">
                <BiError className="text-danger mt-1 mr-1"/><p className="text-danger">Email is mandatory</p>
            </span>}
            <Form onKeyPress={handleKeyPress}>
                <Form.Group className="mb-3">
                    <Form.Control
                        ref={password}
                        {...value}
                        type="text"
                        placeholder="User Id"
                        aria-describedby="inputGroupPrepend"
                        required
                        //onBlur={resetInvitation}
                    />
                </Form.Group>
               {!defaultName &&<Form.Group>
                    <Form.Control
                        ref={userId}
                        type="password"
                        placeholder="Password"
                        aria-describedby="inputGroupPrepend"
                        required
                        //onBlur={resetInvitation}
                    />
                </Form.Group>}
            </Form>
        </RoleListModal>
}
