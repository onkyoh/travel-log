import React from 'react'

const Contacts = ({showContacts}) => {
  return (
    <div className='contacts' style={showContacts ? {visibility: 'visible'} : {visibility: 'hidden'}}>
        Contacts
    </div>
  )
}

export default Contacts