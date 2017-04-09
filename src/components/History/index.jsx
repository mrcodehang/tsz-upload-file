import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Measure from 'react-measure'
import { observer } from 'mobx-react'
import { WithContext as Tags } from 'react-tag-input'


import { PRIMARY } from '../../utils'
import state from '../../stores'
import { Gallery } from '../Gallery'
import CoverComponent from './CoverComponent'
import { intersection } from '../../utils'

let Div = styled.div`
  position: relative;
  flex-basis: 100%;
  padding: 32px;
  
`

let H1 = styled.h1`
  color: ${PRIMARY};
  align-self: center;
`

let SearchWrapper = styled.div`
  position: relative;
  margin: 32px 30%;
  z-index: 1000;
`

let ChangeSource = styled.a`
  margin-right: 12px;
  color: ${PRIMARY};
  font-weight: 500;
  font-size: 1.2em;
  cursor: pointer;
  border-bottom: 1px #8590a6 solid;
`

const History = observer(class History extends Component {

  state = {
    tags: state.searchTags
  }


  componentWillMount() {
    document.body.onscroll = this.handleScroll

  }

  componentDidMount() {
    
  }
  

  componentWillUnmount() {
    // document.body.removeEventListener('scroll', this.handleScroll)
    document.body.onscroll = null
  }

  handleScroll = () => {
    if (this.needLoadFiles()) {
      state.fetchFilesToSourceFilesAction()
    }
  }

  needFillBlank = () => {
    
  }

  needLoadFiles = () => {
    let se = document.scrollingElement
    let curScrollBottom = se.scrollTop + se.clientHeight
    
    return curScrollBottom - this.galleryHeight > -600
  }

  render() {
    let tags = this.state.tags.map((text, key) => ({ text, key }))
    let suggestions = state.sourceTags.filter(tag => (
      !this.state.tags.includes(tag)
    ))

    
    return <Div ref={wrapper => this.wrapper = ReactDOM.findDOMNode(wrapper)}>
      <SearchWrapper>
        <ChangeSource onClick={state.switchDataSourceAction}>{state.dataSourceIsPublic.get()? 'Public' : 'Privacy'}</ChangeSource>
        <div style={{width: '80%', display: 'inline-block'}}>
          <Tags 
            suggestions={suggestions}
            tags={tags}
            autocomplete
            handleAddition={state.addSearchTag}
            handleDelete={state.deleteSearchTag}
          />
        </div>
      </SearchWrapper>
      <Measure whitelist={['width', 'height']} onMeasure={
        ({ height }) => this.galleryHeight = height
      }>
        {
          ({ width }) => (
            <Gallery 
              cols={
                width > 1800?  5 :
                width > 1468?  4 :
                width > 1024?  3 :
                width > 480?   2 : 1
              } 
              photos={state.sourceFiles}
              coverComponent={props => 
                <CoverComponent
                    {...Object.assign({}, props, { photoname: props.filename })}
                />
              }
            />
          )
        }
      </Measure>
    </Div>
  }
})

export default History