import React, { useState, useEffect } from 'react'
import CreateLog from './Logs/CreateLog'
import EditLog from './Logs/EditLog';
import ViewLog from './Logs/ViewLog';

const LogType = ({position, setPosition, placingMarker, setPlacingMarker}) => {

    const [logType, setLogType] = useState("create")

    let logShown;



    switch (logType) {
        case 'create': logShown = <CreateLog position={position} setPosition={setPosition} placingMarker={placingMarker} setPlacingMarker={setPlacingMarker}/>; break;
        case 'view': logShown = <ViewLog/>; break;
        case 'edit': logShown = <EditLog/>; break;
    }

    useEffect(() => {
      if (placingMarker) {
        setPlacingMarker(false)
      }
    }, [logType])

  return (
    <>
        {logShown}
    </>
  )
}

export default LogType