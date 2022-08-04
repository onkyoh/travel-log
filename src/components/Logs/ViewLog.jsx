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
      <p>Please selects a marker to view.</p> 
      :
      <div className='log_container view_log'>
            {currentMarker.pics.length > 0 &&
                currentMarker.pics.map((pic, i) => (
                  <div className='polaroid'>
                    <div key={pic} onClick={() => fullscreenImg(i)}>
                      <img src={pic} alt='trip'/>
                    </div>
                  </div>
                ))            
            }
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