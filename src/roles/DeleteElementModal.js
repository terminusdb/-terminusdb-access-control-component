import React, {useEffect, useState} from "react"
import {Alert, Modal, Button, Form} from "react-bootstrap" 
import {AiOutlineDelete} from "react-icons/ai"
import {AccessControlHook} from "../hooks/AccessControlHook"

export const DeleteElementModal = ({showModal, setShowModal, elementType, elementName,deleteElement,loading,errorMessage,setError}) => {
    const [id, setID]=useState(false)
    const [disabled, setDisabled]=useState(true)
    
    function handleClick () {
        if(disabled) return;
        deleteElement(id)
    }
    
    function handleOnChange (e) {
        if(e.target.value === elementName){
            setID(e.target.value)
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }
 
    function handleClose (e) {
        if(setShowModal) setShowModal(false)
    }
    //<Loading message={`Deleting Data Product ${dataProductDetails.label} ...`} type={PROGRESS_BAR_COMPONENT}/>}
    return <Modal size="lg" className="modal-dialog-right" show={showModal} onHide={handleClose}>
        <Modal.Header>
            <Modal.Title className="h6">{`Are you sure to delete ${elementType} - ${elementName} ?`} </Modal.Title>
            <Button variant="close" aria-label="Close" onClick={handleClose} />
        </Modal.Header>
        <Modal.Body className="p-5">
            {errorMessage && 
             <Alert variant="danger"  onClose={() => setError(false)} dismissible>{errorMessage}</Alert>}
            <div className="d-flex align-items-center col-md-12 mb-3">
                <h6 className="fw-normal text-muted">{elementType} </h6><span className="ml-3"></span>
                <h6 className="ml-3">{elementName}</h6>
            </div>
            <Form onSubmit={handleClick}>
                <Form.Group className="mb-3">
                    <Form.Control required 
                        id="delete_element_name" 
                        type="text"
                        onChange={handleOnChange} 
                        placeholder={`Please type the ${elementType} ID you wish to delete`} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button
                id ="delete_element_button"
                variant="danger" 
                title={`Delete ${elementType} ${elementName}`} 
                disabled={disabled || loading}
                onClick={handleClick}>
                <AiOutlineDelete className="me-2" /> {loading ? 'Loading ...' : "Delete"}  
            </Button>
        </Modal.Footer>
    </Modal>
}

