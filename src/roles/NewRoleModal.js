import React, {useState, useRef} from "react"
import {AccessControlHook} from "../hooks/AccessControlHook"
import {Modal, Button, Form,Row,Col} from "react-bootstrap"
import {BsFillPeopleFill} from "react-icons/bs"
//import {PROGRESS_BAR_COMPONENT, TERMINUS_DANGER,TERMINUS_SUCCESS} from "./constants"
import {UTILS} from "@terminusdb/terminusdb-client"


export const NewRoleModal= ({show, setShow, accessControlDashboard,options}) => {
    if(!accessControlDashboard) return ""


    const {createRole,
          successMessage,
          loading,
          resetInvitation,
          errorMessage} =  AccessControlHook(accessControlDashboard.accessControl(),options)
    const [error, setError]=useState(false)
    const [actionsSelected, setActions] = useState({})

    const roleId = useRef(null);
    const roleName = useRef(null);
    const roles = accessControlDashboard.getRolesList()

    async function runCreateRole(role){
        const id = roleId.current.value
        const name = roleName.current.value
        
        //alert(email)
        if(!roleId || roleId === "") {
            setError(true)
            return
        }else{
            //await createRole()
            roleId.current.value = ""
            roleName.current.value = ""  
            setError(false)                    
        }
    }

    function addAction(evt){
        const action = evt.currentTarget.name
        const check = evt.currentTarget.checked
        if(check){
            actionsSelected[action]=action
        }else if(actionsSelected[action]){
            delete actionsSelected[action]
        }
    }

    function handleKeyPress(e) {
        if (e.which === 13 /* Enter */) {
            e.preventDefault()
        }
    }

    function ActionList (){
        const actArr = Object.values(UTILS.ACTIONS)
        const checkList = []
        alert(actArr.length)
       
        for(let i=0; i<actArr.length; i+=2) {
           const item = actArr[i]
           const itemleft =  actArr[i+1]     
           let row = <Row>
                            <Col>
                                <Form.Check className="d-flex align-items-center mb-4" type="checkbox" key={item}  >
                                <Form.Check.Input  name={item} id={item} className="p-3" type="checkbox" onClick={addAction} />
                                <Form.Check.Label className="ml-4">{item}</Form.Check.Label>                 
                                </Form.Check>
                            </Col>
                            {itemleft && <Col>
                                <Form.Check className="d-flex align-items-center mb-4" type="checkbox" key={itemleft}  >
                                <Form.Check.Input name={item}  id={itemleft} className="p-3" type="checkbox" onClick={addAction} />
                                <Form.Check.Label className="ml-4">{itemleft}</Form.Check.Label>                 
                                </Form.Check>
                           
                            </Col> }
                        </Row>
             checkList.push(row)     
        }
        return checkList
    }

    return <Modal show={show}  size="lg"onHide={(e) => setShow(false)}>
        <Modal.Header closeButton>
            <h5 className="text-success mt-3 mb-3">{options.labels.createRole}</h5>
        </Modal.Header>
    <Modal.Body>
        {/*teamCreated && 
        <Alerts id="alert_team_created" message={"the team has been created"} type={TERMINUS_SUCCESS}/>}
        {errorMessage &&  <Alerts id="alert_team_created_error" message={errorMessage} type={TERMINUS_DANGER}/>}

        {error && <span className="d-flex">
        <BiError className="text-danger mt-1 mr-1"/><p className="text-danger">Team name is mandatory</p>
        </span>*/}
        <Form>
            <Form.Group>
                <Form.Control
                    ref={roleId}
                    type="text"
                    id="id"
                    placeholder="Role id"
                    aria-describedby="inputGroupPrepend"
                    required
                />
            </Form.Group>
            <Form.Group className="mt-3">
                <Form.Control
                    ref={roleName}
                    type="text"
                    id="name"
                    placeholder="Role name"
                    aria-describedby="inputGroupPrepend"
                    required
                />
            </Form.Group>
                <h6 className="mt-3 mb-3">Scopes define the access for the role</h6>
                <ActionList/>
            
        </Form>
    </Modal.Body>
    <Modal.Footer>
    {!loading && <Button className="btn-info" onClick={runCreateRole} id="create_new_team_button">
                <BsFillPeopleFill className="mr-2"/>{options.labels.createRole}
            </Button>}
    {loading && <div>`Creating a new team ...` </div> }
    </Modal.Footer>
    </Modal>
}

//<Form.Check type="radio" aria-label="radio 1" />
