import React from 'react'

const ViewLog = ({currentMarker}) => {

  return (
    <div className='log_container'>
      {!currentMarker ? 
      <p>Please selects a marker to view.</p> 
      :
      <div className='log_container view_log'>
          <div className='view_details'>
            <h5>Where?</h5>
            <p>
            {currentMarker.place || ""}
            {currentMarker.place ? <br/> : ""}
            {currentMarker.coordinates[0].toFixed(3) + ' , '+ currentMarker.coordinates[1].toFixed(3)}
            </p>
          </div>
          <div className='view_details'>
            <h5>What?</h5>
            <p>{currentMarker.desc}</p>
          </div>
          <div className='polaroid_grid'>
            {currentMarker.pics.length > 0 &&
                currentMarker.pics.map((pic, i) => (
                  <a className='polaroid' href={pic} target="_blank" rel="noreferrer">
                    <div>
                      <img src={pic} alt='trip'/>
                    </div>
                    <span>{currentMarker.date || ""}</span>
                  </a>
                ))            
            }
            </div>
      </div>
      }
    </div>
  )
}

export default ViewLog