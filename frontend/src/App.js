import React, { useState } from 'react'
import axios from 'axios'
import Cropper from 'react-cropper'

import 'cropperjs/dist/cropper.css'

import './App.css'

const App = () => {

  const [ image, setImage ] = useState()
  const [ toCrop, setToCrop ] = useState(false)
  const [ cropData, setCropData ] = useState('#')
  const [ cropper, setCropper ] = useState()  
  const [ segImage, setSegImage ] = useState(null)

  const onChange = (e) => {
    e.preventDefault()
    setImage(e.target.files[0])
    setToCrop(false)
    setCropData('#')
    setSegImage(null)
  }

  const getCropData = () => {
    if ( typeof cropper !== 'undefined' ) {
      setCropData(cropper.getCroppedCanvas().toDataURL())   
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    let formData = new FormData()
    
    if (cropData !== '#') {
      formData.append('image', cropData)
    } else {
      formData.append('image', image)
    }

    let url = 'http://localhost:8000/api/posts/'
    axios.post(url, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
    .then(res => {
      // console.log(res.data.image)
      setSegImage(res.data.image)
    })
    .catch(err => console.log(err))
  }

  const handleCrop = () => {
    setToCrop(!toCrop)
  }

  return (
    <div className="app">
      <form onSubmit={handleSubmit} className='form-control'>
        <div className='input-file'>
          <input type='file' onChange={onChange} />
        </div>
        {
          image &&
          <button type='submit'>Get Segmented Image</button>
        }
      </form>
      <br />
      <div className='image'>
        
        {
          toCrop && 
          <div className='cropping-image'>
            <Cropper 
              style={{ height: 400, width: 400 }}
              initialAspectRatio={1}
              // preview='.img-preview'
              src={URL.createObjectURL(image)}
              viewMode={1}
              guides={true}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              onInitialized={(instance) => {
                setCropper(instance)
              }}
            /> 
          </div>
        }
        {
          image && 
          !toCrop && 
          <div className='preview-image'>
            <img 
              src={URL.createObjectURL(image)}
              style={{ width: 400, height: 400}}
              alt='preview'
            />
          </div>
        }
        {
          toCrop &&
          cropData !== '#' &&
          <div className='cropped-image'>
            <img 
              src={cropData}
              style={{ width: 'auto', height: 400}}
              alt='cropped'
            />
          </div>
        }
        {
        segImage &&
        <div className='segmented-image'>
          <img 
            src={`http://127.0.0.1:8000${segImage}`}
            style={{ width: 'auto', height: 400}}
            alt='segmentedImage'
          />
        </div>
      }
      </div>
      <br />
      {
        toCrop && 
        <div className='enable-crop-botton'>
          <button 
            onClick={getCropData}
          >
            Crop
          </button>
        </div>
      }
      <br />
      {
        image &&
        !toCrop &&
        <div className='crop-botton'>
          <button onClick={handleCrop}>Crop Image</button> 
        </div>
      }
    </div>
  )
}

export default App
