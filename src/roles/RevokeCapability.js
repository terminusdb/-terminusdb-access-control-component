import React from "react"
import {AccessControlHook} from "../hooks/AccessControlHook"
import { DeleteElementModal } from "./DeleteElementModal"

export const RevokeCapability = ({accessControlDashboard,showModal, setShowModal,  selectedRow, updateTable }) => {
   
    const {manageCapability,loading,errorMessage,setError} =  AccessControlHook(accessControlDashboard,{})
    
    const deleteElement = () =>{
        manageCapability(selectedRow.scope,"revoke",selectedRow.role, selectedRow["@id"]).then(done=>{
            if(done){
                updateTable()
                setShowModal(false)
            }
        })
   }

   const vars = {showModal, setShowModal, elementType:"User", elementName:selectedRow.username,loading,errorMessage,setError}
   return <DeleteElementModal deleteElement={deleteElement} {...vars} />
    
}