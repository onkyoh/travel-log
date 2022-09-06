import React from 'react'

const ViewLog = ({currentMarker}) => {

  return (
    <div className='log_container'>
      {!currentMarker ? 
      <p className='view_dialog'>
        Please selects a marker to view.
      </p> 
      :
      <div className='log_container view_log'>
          <div className='view_details'>
            <p>
              <h5>{currentMarker.place || ""}</h5>
              <span>{currentMarker.coordinates[0].toFixed(2)}&deg;N, {currentMarker.coordinates[1].toFixed(2)}&deg;E</span>
            </p>
            <p>{currentMarker.desc}</p>
          </div>
          <div className='polaroid_grid'>
            {currentMarker.pics.length > 0 &&
                currentMarker.pics.map((pic, i) => (
                  <a className='polaroid' key={pic} href={pic} target="_blank" rel="noreferrer">
                    <div>
                      <img src={pic} alt='trip' loading='eazy'/>
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