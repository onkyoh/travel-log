import React, {useContext, useEffect, useState} from 'react'
import { UserContext } from '../../App'
import { MarkerContext } from '../../screens/MainInterface'


const ViewLog = ({logId}) => {

  const currentUser = useContext(UserContext)
  const markers = useContext(MarkerContext)

  const [currentMarker, setCurrentMarker] = useState()
  const [idx, setIdx] = useState()

  const getLogData = () => {
    const idx = markers.findIndex(marker => marker.id === logId)
    if (idx === -1) {
      console.log('This logs details could not be found.')
      return
    }
    setCurrentMarker(markers[idx])
    console.log(markers[idx])
  }

  useEffect(() => {
    if (logId) {
      getLogData()
    }
  }, [logId])


  return (
    <div className='log_container'>
      {!currentMarker ? 
      <p>Please select a marker to view.</p> 
      :
      <div className='view_log'>
        <div>
            {currentMarker.place && <p>{currentMarker.place}</p>}
            <p>{currentMarker.coordinates[0].toFixed(3) + ', ' +  currentMarker.coordinates[1].toFixed(3)}</p>
            {currentMarker.pics.length > 0 &&
            <div>
                {currentMarker.pics.map((pic, i) => (
                  <img key={pic} src={pic} />
                ))}              
            </div>
            }
        </div> 
      </div>
      }
    </div>
  )
}

export default ViewLog