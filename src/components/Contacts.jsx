import React from 'react'

const Contacts = ({showContacts}) => {
  return (
    <div className='contacts aside_positioning' style={showContacts ? {visibility: 'visible'} : {visibility: 'hidden'}}>
        Contacts
    </div>
  )
}

export default Contacts