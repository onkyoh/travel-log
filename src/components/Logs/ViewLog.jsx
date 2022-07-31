import React, {useContext, useEffect, useState} from 'react'
import { db } from '../../firebase-config'
import { getDoc, doc } from 'firebase/firestore'
import { UserContext } from '../../App'

const ViewLog = ({logId}) => {

  const currentUser = useContext(UserContext)

  const [view, setView] = useState()

  const getLogData = async () => {
    // const logData = await(getDoc(doc(db, 'users', currentUser)))
    //query for marker marker.id === logId 
  }

  useEffect(() => {
    if (logId) {
      getLogData()
    }
    console.log('log id', logId)
  }, [logId])


  return (
    <div className='log_container'>
      {!logId ? 
      <p>Please Select a marker to view.</p> 
      :
        <div className='view_log'>
            <div>
              <p>Location</p>
              <p></p>
            </div>
        </div>
      }
    </div>
  )
}

export default ViewLog