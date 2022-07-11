import React, {Fragment,useState} from "react"
import {Modal, Button, Form} from "react-bootstrap"
import {FiUserPlus} from "react-icons/fi"
import {TERMINUS_DANGER,TERMINUS_SUCCESS} from "../constants"
import {Alerts} from "../Alerts"

export const RoleList = ({setRole,role,roles,parentRole}) => {  
    let maxLength = Array.isArray(roles) ? roles.length : null
    return <Fragment> 
        {maxLength && roles.map((item,index) => {
        if(item['@id']===parentRole) maxLength = index
        //I visualize only the allowed roles
        if(index > maxLength ) return
        const isChecked = item['@id'] === role ? {checked:true} : {}     
        return <Fragment>
                    <Form.Check className="d-flex align-items-center mb-4" type="radio" key={item['@id']} name="group1" >
                    <Form.Check.Input name="group1" id={item['@id']} className="p-3" type="radio" {...isChecked} onClick={()=>{setRole(item['@id'])}} />
                    <Form.Check.Label className="ml-4">{item['name']}</Form.Check.Label>  
                    <div className="p-4">{item.description}</div>                 
                    </Form.Check>               
                </Fragment>      
    })  
    } 
    </Fragment> 
}

export const RoleListModal = (props)=>{
    const [role, setRole]=useState(props.role || "Role/collaborator")
    const roles = props.rolesList
    return <Modal
            show={props.show}
            size="lg"
            onHide={(e) => props.setShow(false)}>
        <Modal.Header closeButton>
            <h5 className="text-success mt-3 mb-3">{props.title}</h5>
        </Modal.Header>
        <Modal.Body>
            {props.successMessage &&
            <Alerts message={"the invitation has been sent"} type={TERMINUS_SUCCESS}/>}
            {props.errorMessage &&  <Alerts message={props.errorMessage} type={TERMINUS_DANGER}/>}

            {props.children}
            {roles &&
                <RoleList setRole={setRole} role={role} roles={roles} parentRole={props.parentRole}/>
            }
        </Modal.Body>
        <Modal.Footer>
        {!props.loading && <Button className="btn-info" onClick={()=>{props.clickButton(role)}}>
                    <FiUserPlus className="mr-2"/>Send
                </Button>}
        {/*props.loading && <Loading message={`Sending request ...`} />*/}
        </Modal.Footer>
        </Modal>
}

//"Please enter a valid email to send an invitation""the invitation has been sent",`Invite a new member to your team - ${team}`