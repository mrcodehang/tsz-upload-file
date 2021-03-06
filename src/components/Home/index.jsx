import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import _UploadIcon from 'react-icons/lib/md/file-upload'
import { observer } from 'mobx-react'
import CloseIcon from 'react-icons/lib/md/close'
import ReactTooltip from 'react-tooltip'


import { PRIMARY } from '../../utils'
import state from '../../stores'
import ImageUrlView from './ImageUrlView'
import Notice from '../Notice/index'
import { INFO, ERROR } from '../../utils'

let stopUploading = () => state.isUploading.set(false)
let handleError = () => void(stopUploading()) || state.uploadingError.set(false)

let Div = styled.div`
  margin: 2em 0;
`

let List = styled.ul`
  width: 100%;
  list-style-type: none;
`

let H1 = styled.h1`
  font-size: 2em;
  padding: .4em 0;
  border-bottom: lightgray 1px solid; 
  color: ${PRIMARY};
  
  &::after {
    padding-left: 2em;
    font-size: .5em;
    content: '5 MB max per file.';
  }
`

let UploadImageArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: dashed ${PRIMARY} 2px;
  border-radius: 4px;
`

let Main = styled.main`
  padding: 0 20%;
  flex-basis: 100%;
`

let P = styled.p`
  color: ${PRIMARY};
  margin: 0 0 2em;
  font-size: 1.5em;
`

let UploadIcon = styled(_UploadIcon)`
  width: 4em;
  height: 4em;
  margin: 5em 0 .5em;
  color: ${PRIMARY};
`

const UrlList = observer(function ({ uploadedFiles }) {
  return <List>
    {uploadedFiles.map((result, index) => (
      <li 
        key={result.timestamp + result.url} 
        style={{ margin: '1em 0' }}
      >
        <ImageUrlView {...result} />
      </li>
    ))}
  </List>
})

const Home = observer(class Home extends Component {

  state = { urlViews: null }
  filesInput = document.createElement('input')

  componentDidMount() {
    this.filesInput.setAttribute('type', 'file')

    this.filesInput.multiple = true
    this.filesInput.addEventListener('change', this.filesChangeHandler)
  }

  componentWillUnmount() {
    this.filesInput.removeEventListener('change', this.filesChangeHandler)
  }

  filesChangeHandler = async event => {
    await state.uploadFilesAction(this.filesInput.files)
  }

  dragOverHandler = event => {
    event.preventDefault()
    event.stopPropagation();
    return false;
  }

  dragEnterHandler = () => {
    ReactDOM.findDOMNode(this.uploadImage).style.backgroundColor = 'whitesmoke'
  }
  

  dragLeaveHandler = () => {
    ReactDOM.findDOMNode(this.uploadImage).style.backgroundColor = ''
  }

  dropHandler = async (event) => {
    event.preventDefault()
    let files = event.dataTransfer.files
 
    this.dragLeaveHandler()
    if (event.dataTransfer.files.length && files[0].type.indexOf('image') !== -1) {
      await state.uploadFilesAction(files)
    }
  }

  clicHandler = async () => {
    this.filesInput.click()
  }

  renderNotice = () => {
    let show = state.isUploading.get() || state.uploadingError.get()
    let text = state.uploadingError.get()? 'uploading failed!' 
      : `uploaded: ${state.uploadedFilesCount.get() || 0} 
        remain: ${state.remainFilesCount.get() || 0}`
    let status = state.uploadingError.get()? ERROR : INFO
    let icon = <CloseIcon onClick={state.uploadingError.get()? handleError : stopUploading} />

    return <Notice status={status} show={show} text={text} icon={icon} />
  }

  render() {
    return <Main>
      <Div>
        <H1>Image Upload</H1>
      </Div>
      <Div>
        <ReactTooltip 
          id="uploadFileTooltip" 
          aria-haspopup="true"
        >
          Click to upload
        </ReactTooltip>
        <UploadImageArea
          onClick={this.clicHandler} 
          onDragEnter={this.dragEnterHandler}
          onDragLeave={this.dragLeaveHandler}
          onDragOver={this.dragOverHandler}
          onDrop={this.dropHandler}
          ref={uploadImage => this.uploadImage = uploadImage}
          data-for="uploadFileTooltip"
          data-tip
          >
          <UploadIcon />
          <P>Drag and drop here</P>
        </UploadImageArea>
        <UrlList uploadedFiles={state.uploadedFiles}/>
      </Div>
      {this.renderNotice()}
    </Main>
  }
})

export default Home