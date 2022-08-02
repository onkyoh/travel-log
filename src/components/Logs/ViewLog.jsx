import React, {useState} from 'react'

const ViewLog = ({currentMarker}) => {

  const [bigImg, setBigImg] = useState("")

  const fullscreenImg = (idx) => {
    setBigImg(currentMarker.pics[idx])
  }

  const closeFullscreen = () => {
    setBigImg("")
  }

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
            <div className='view_img_grid'>
                {currentMarker.pics.map((pic, i) => (
                  <div key={pic} onClick={() => fullscreenImg(i)}>
                    <img src={pic} alt='trip'/>
                  </div>
                ))}              
            </div>
            }
        </div> 
        {bigImg && 
          <div className='fullscreen_img'>
            <button onClick={closeFullscreen}>X</button>
            <img src={bigImg} alt='fullscreen trip'/>
          </div>
        }
      </div>
      }
    </div>
  )
}

export default ViewLog