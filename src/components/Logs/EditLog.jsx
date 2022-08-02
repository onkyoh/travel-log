import React from 'react'

const EditLog = ({currentMarker}) => {

  const submitEdit = (e) => {
    e.preventDefault()

  }

  return (
    <div className='log_container'>
      {!currentMarker ?
      <p>Please select a marker to edit.</p>
       :
      <form onSubmit={(e) => submitEdit(e)}>
       
      </form>
      }

    </div>
  )
}

export default EditLog