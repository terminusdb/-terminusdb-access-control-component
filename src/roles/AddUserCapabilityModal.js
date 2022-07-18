import React, {useState, useRef, useEffect} from "react"
import {Form} from "react-bootstrap"
import {BiError} from "react-icons/bi"
import {AccessControlHook} from "../hooks/AccessControlHook"

import { RoleListModal } from "./RoleList"

//create user if do not exists and add to team
export const AddUserCapabilityModal = ({showModal, setShowModal, team, accessControlDashboard,options,defaultName,rowSelected}) => {
    if(!accessControlDashboard) return ""
    const {successMessage,
            addUserToTeam,
          loading,
          errorMessage} =  AccessControlHook(accessControlDashboard,options)
    const [error, setError]=useState(false)

    const userId = useRef(null);
    const password = useRef(null);
    const roles = accessControlDashboard.getRolesList()

    async function addUser(role){
        const userId =  rowSelected["@id"]
        //const name = userId.current.value
        //const passwordVal = password.current && password.current.value ? password.current.value : null
        //alert(email)
        //if(!name || (!passwordVal && !defaultName)) {
          //  setError(true)
           // return
        //}else{
        await addUserToTeam(team,userId,'',role)
        //userId.current.value = ""
        if(!defaultName)password.current.value = ""
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
    const value =  defaultName ? {value:defaultName, disabled:true} : {}

    return <RoleListModal {...propsObj} 
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
                </Form.Group>}
            </Form>
        </RoleListModal>
}
