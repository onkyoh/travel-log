import React, { useState, useEffect } from 'react'
import CreateLog from './Logs/CreateLog'
import EditLog from './Logs/EditLog';
import ViewLog from './Logs/ViewLog';

const LogType = ({position, setPosition, placingMarker, setPlacingMarker, logId, setLogId, refreshMarkers, setRefreshMarkers}) => {

    const [logType, setLogType] = useState("create")

    let logShown;

    switch (logType) {
        case 'create': logShown = <CreateLog position={position} setPosition={setPosition}
         placingMarker={placingMarker} setPlacingMarker={setPlacingMarker}
          setLogType={setLogType} setLogId={setLogId}/>; break;

        case 'view': logShown = <ViewLog logId={logId}/>; break;
        case 'edit': logShown = <EditLog/>; break;
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