import React, { Component, PropTypes } from 'react'
import styled from 'styled-components'

import { PRIMARY } from '../../utils'
let Img = styled.img`
  width: 100%;
  opacity: ${props => props.hidden? '0' : '1'}
  margin: ${props => props.margin}px;
  margin-bottom: ${props => props.margin - 4}px;
  margin-top: 0;
  background-color: ${PRIMARY};
  transition: all .3s ease-in-out;
`

let ImageWrapper = styled.div`
  display: inline-block;
  position: relative;
  
  vertical-align: top;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  cursor: ${props => props.isPointer? 'pointer' : null}
`

let CoverComponentWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
`

export default class Image extends Component {

  state = { 
    coverComponent: null,
    hidden: true
  }

  clickHandler = () => {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this.props)
    }
  }

  mouseEnterHandler = () => {
    if (typeof this.props.coverComponent === 'function') {
      this.setState({ coverComponent: this.props.coverComponent(this.props) })
    }
  }

  mouseLeaveHandler = () => {
    this.setState({ coverComponent: null })
  }

  imageLoadedHandler = () => {
    this.setState({ hidden: false })
  }

  render() {
    return <ImageWrapper
      isPointer={this.props.isPointer}
      style={{borderRadius: this.props.radius + 'px'}}
    >
      <Img
        onLoad={this.imageLoadedHandler}
        hidden={this.state.hidden}
        src={this.props.url} alt={this.props.alt}
        style={{ width: 100 + '%' }}
        margin={this.props.margin}
      />
      <CoverComponentWrapper
        onClick={this.clickHandler} 
        onMouseEnter={this.mouseEnterHandler}
        onMouseLeave={this.mouseLeaveHandler}
      >
        {this.state.coverComponent}
      </CoverComponentWrapper>
  </ImageWrapper>
  }

}