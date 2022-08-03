import React, {Fragment,useState} from "react"
import {Modal, Button, Form} from "react-bootstrap"
import {FiUserPlus} from "react-icons/fi"
import {TERMINUS_DANGER,TERMINUS_SUCCESS} from "../constants"
import {Alerts} from "../Alerts"

export const RoleList = ({setRole,userRoles,rolesList,parentRole,type}) => {  
    let maxLength = Array.isArray(rolesList) ? rolesList.length : null
    const itemType = type || "radio"
    return <Fragment> 
        {maxLength && rolesList.map((item,index) => {
        if(item['@id']===parentRole) maxLength = index
        //I visualize only the allowed roles
        if(index > maxLength ) return
        let isChecked = userRoles.find(role=> item['@id'] === role) ? {checked:true} :{}
        //console.log("isChecked", isChecked)
        return <Fragment>
                    <Form.Check className="d-flex align-items-center mb-4" type={itemType} key={item['@id']} name="group1" >
                    <Form.Check.Input name="group1" id={item['@id']} className="p-3" type={itemType} {...isChecked} onChange={(evt)=>{setRole(evt,item['@id'])}} />
                    <Form.Check.Label className="ml-4">{item['name']}</Form.Check.Label>  
                    <div className="p-4">{item.description}</div>                 
                    </Form.Check>               
                </Fragment>      
    })  
    } 
    </Fragment> 
}

export const RoleListModal = (props)=>{
    
    const [userRoles, setRole]=useState(props.userRoles || ["Role/collaborator"])

    const setNewRole = (evt,role) =>{
        const checked = evt.target.checked
        if(checked){
            userRoles.push(role)
        }else{
            const index = userRoles.find(role)
            if(index>-1){
                userRoles.splice(index,1)
            }
        }
        setRole(userRoles)
    }

    const rolesList = props.rolesList
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
            {rolesList &&
                <RoleList type={props.type} setRole={setNewRole} userRoles={userRoles} rolesList={rolesList} parentRole={props.parentRole}/>
            }
        </Modal.Body>
        <Modal.Footer>
        {!props.loading && <Button className="btn-info" onClick={()=>{props.clickButton(userRoles)}}>
                    <FiUserPlus className="mr-2"/>Send
                </Button>}
        {/*props.loading && <Loading message={`Sending request ...`} />*/}
        </Modal.Footer>
        </Modal>
}

//"Please enter a valid email to send an invitation""the invitation has been sent",`Invite a new member to your team - ${team}`