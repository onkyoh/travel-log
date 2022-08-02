import React, { useState, useEffect, useContext } from 'react'
import CreateLog from './Logs/CreateLog'
import EditLog from './Logs/EditLog';
import ViewLog from './Logs/ViewLog';
import { MarkerContext } from '../screens/MainInterface';

const LogType = ({position, setPosition, placingMarker, setPlacingMarker, logId, setLogId, refreshMarkers, setRefreshMarkers}) => {

    const [logType, setLogType] = useState("create")
    const [currentMarker, setCurrentMarker] = useState()
    const markers = useContext(MarkerContext)

    let logShown;

    switch (logType) {
        case 'create': logShown = <CreateLog position={position} setPosition={setPosition}
         placingMarker={placingMarker} setPlacingMarker={setPlacingMarker}
          setLogType={setLogType} setLogId={setLogId}/>; break;

        case 'view': logShown = <ViewLog currentMarker={currentMarker}/>; break;
        case 'edit': logShown = <EditLog currentMarker={currentMarker}/>; break;
    }

    const handleLogType = (type) => {
      setLogType(type)
    }

    const activeTab = {
      backgroundColor: '#f33f90',
      color: 'white',
    }

    useEffect(() => {
      if (placingMarker) {
        setPlacingMarker(false)
      }
      if (logType === 'view') {
        setRefreshMarkers(refreshMarkers + 1)
      } 
    }, [logType])

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
    <aside className='log_aside'>  
      <div className='log_button_group'>
        <button onClick={() => handleLogType('view')} style={logType === 'view' ? activeTab : null}>View</button>
        <button onClick={() => handleLogType('create')} style={logType === 'create' ? activeTab : null}>Create</button>
        <button onClick={() => handleLogType('edit')} style={logType === 'edit' ? activeTab : null}>Edit</button>
      </div>
        {logShown}
    </aside>
  )
}

export default LogType