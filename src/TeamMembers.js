 import React, {useState} from "react"
import {Row, Tab, Tabs} from "react-bootstrap"
import {NewMemberModal} from "./roles/NewMemberModal"
import {INVITATION_TAB, MEMBERS_TAB} from "./constants"
import {RiUserShared2Fill} from "react-icons/ri"
import {FaUsers} from "react-icons/fa"
import {InvitationsList} from "./roles/InvitationsList"
import {MembersList} from "./roles/MembersList"
import {defaultSetting} from "./utils/default"
import {AskToJoinList} from "./roles/AskToJoinList"
import {AllUserList} from "./roles/AllUserList"
import { RoleListTable } from "./roles/RolesListTable"
import { OrganizationList } from "./roles/OrganizationList"

export const TeamMembers = ({organization,currentUser,accessControlDashboard,options}) => {
    if(!accessControlDashboard) return ""
    const [key, setKey] = useState()

    const [showNewMemberModal, setShowNewMemberModal] = useState(false)
   
    const [defaultEmail, setDefaultEmail] = useState(false)
    const [defaultUser, setDefaultUser] = useState(false)

    const settings = Object.assign({}, defaultSetting, options);

    const showNewMemberAction = (email=false,show=true) => {
        setDefaultEmail(email)
        setShowNewMemberModal(show)
    }

    return <React.Fragment>
        <div style={{marginTop: "20px"}} className="mb-3">
            <Row className="ml-3">
                <h4 className="mt-4 text-success fw-bold">{settings.labels.userListTitle}</h4>
                <h6 className="text-muted fw-bold">{`${settings.labels.inviteAddText}`}</h6>
            </Row>
        </div>

        {showNewMemberModal && 
            <NewMemberModal accessControlDashboard={accessControlDashboard} options={settings} defaultEmail={defaultEmail}
                team={organization} show={showNewMemberModal} setShow={setShowNewMemberModal}/>
        }
        <Row className="d-flex justify-content-end pr-4">
            {settings.buttons.ADD_INVITATION &&   
                <button onClick={()=>showNewMemberAction(false)} style={{maxWidth:"200px"}} title="Invite a member"
                    type="button" className="btn-new-data-product mr-1 pt-2 pb-2 pr-4 pl-4 btn btn-sm btn btn-info">
                        {settings.labels.inviteMember}
                </button>
            }
            {/*settings.buttons.ADD_USER &&
                <button onClick={()=>setShowNewUserModal(true)} style={{maxWidth:"200px"}} title="Add Role"
                    type="button" className="btn-new-data-product mr-1 pt-2 pb-2 pr-4 pl-4 btn btn-sm btn btn-info">
                        {settings.labels.addUser}
                </button>
            */}
            </Row>
        <Tabs id="members-tab"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 ml-4 mr-4">
            {settings.tabs.MEMBERS_TAB &&
                <Tab eventKey={MEMBERS_TAB}  title={<span><FaUsers className="mr-1"/>{MEMBERS_TAB}</span>}>
                    <MembersList options={settings}  team={organization} currentUser={currentUser} accessControlDashboard={accessControlDashboard}/>
                </Tab>
            }
            {settings.tabs.INVITATION_TAB &&   
                <Tab eventKey={INVITATION_TAB}   title={<span><RiUserShared2Fill className="mr-1"/>{INVITATION_TAB}</span>}>
                    <InvitationsList options={settings}  team={organization} setShow={showNewMemberModal}  accessControlDashboard={accessControlDashboard}/>
                </Tab>
        }
            {settings.tabs.REQUEST_ACCESS && 
                <Tab eventKey={"REQUEST_ACCESS"}   title={<span><RiUserShared2Fill className="mr-1"/>{"ASK FOR ACCESS"}</span>}>
                    <AskToJoinList options={settings}  team={organization} setShow={showNewMemberAction}  accessControlDashboard={accessControlDashboard}/>
                </Tab>
            }
            { settings.tabs.ORGANIZATION_LIST && 
                <Tab eventKey={"ORGANIZATION_LIST"}   title={<span><RiUserShared2Fill className="mr-1"/>{"ORGANIZATIONS"}</span>}>
                    <OrganizationList options={settings}   accessControlDashboard={accessControlDashboard}/>
                </Tab>
            }
            {settings.tabs.ALL_USER && 
                <Tab eventKey={"ALL_USER"}   title={<span><RiUserShared2Fill className="mr-1"/>{"ALL THE USERS"}</span>}>
                    <AllUserList options={settings}   accessControlDashboard={accessControlDashboard}/>
                </Tab>
            }
            { settings.tabs.ROLES_LIST && 
                <Tab eventKey={"ROLES_LIST"}   title={<span><RiUserShared2Fill className="mr-1"/>{"ROLE List"}</span>}>
                    <RoleListTable options={settings}  accessControlDashboard={accessControlDashboard}/>
                </Tab>
            }
        </Tabs>
    </React.Fragment>
}
