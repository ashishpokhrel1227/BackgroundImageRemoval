import React, { useState } from 'react'
import axios from 'axios'
import Cropper from 'react-cropper'
import FileSaver from 'file-saver'

import 'cropperjs/dist/cropper.css'
import Loader from './Loader'

import './App.css'

const App = () => {

  const [ image, setImage ] = useState()
  const [ toCrop, setToCrop ] = useState(false)
  const [ cropData, setCropData ] = useState('#')
  const [ cropper, setCropper ] = useState()  
  const [ segImage, setSegImage ] = useState(null)
  const [ foreground, setForeground ] = useState(null)
  const [ loading, setLoading ] = useState(false)

  const onChange = (e) => {
    e.preventDefault()
    setImage(e.target.files[0])
    setToCrop(false)
    setCropData('#')
    setSegImage(null)
    setForeground(null)
  }

  const getCropData = () => {
    if ( typeof cropper !== 'undefined' ) {
      setCropData(cropper.getCroppedCanvas().toDataURL())  
      setForeground(null) 
      setSegImage(null)
      // console.log('foreground is: ', foreground) 
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)
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
      setLoading(false)
      console.log('foreground image is: ', foreground)
    })
    .catch(err => console.log(err))
  }

  const handleCrop = () => {
    setToCrop(!toCrop)
    setSegImage(null)
    setForeground(null)
  }

  const getForegroundImage = () => {
    let url = 'http://localhost:8000/api/foreground/'
    axios.get(url)
    .then(res => {
      // console.log(res)
      setForeground(res.data.img)
    })
    .catch(err => console.log(err))
  }

  const downloadForeground = () => {
    FileSaver.saveAs(`http://localhost:8000${foreground}`, `foreground_${Math.random()}.png`)
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
      {
        loading ?
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
            <Loader></Loader>
          </div>
        :
          <React.Fragment>
            <div className='image'>  
              {
                toCrop && 
                !foreground &&
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
                    style={{ width: 'auto', height: 400}}
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
              {
                foreground &&
                <div className='foreground-image' style={{ marginLeft: '5px'}}>
                  <img
                    src={`http://127.0.0.1:8000${foreground}`} 
                    style={{ width: 'auto', height: 400 }}
                    alt='foregroundImage'
                  />
                </div>
              }
            </div>
            <br />
            <div className='botton'>
              {
                segImage &&
                <div className='foreground-botton'>
                  <button
                    onClick={getForegroundImage}
                  >
                    Get Foreground
                  </button>
                </div>
              }
              {
                toCrop && 
                // !foreground &&
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
              {
                foreground &&
                <div className='download-botton' style={{ marginLeft: '5px'}}>
                  <button onClick={downloadForeground}>Download foreground</button>
                </div>
              }
            </div>
        </React.Fragment>
      }
      <br />
    </div>
  )
}

export default App
