import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classnames from 'classnames'
import Popperjs from 'popper.js'
import Root from './Root'

import './Popper.less'

interface IPopperProps {
  popper: React.ReactElement<any>
  placement?: string
  hoverMode?: boolean
  visible?: boolean
  className?: string
}

interface IPopperState {
  visible: boolean
}

type ReactInstance = React.ReactInstance

export default class Popper extends Root<IPopperProps, IPopperState> {
  popperElement: HTMLDivElement
  referenceElement: HTMLElement | ReactInstance
  popper: Popperjs
  private enterTimer: number
  private leaveTimer: number

  $refs = {
    popperElement: (el: HTMLDivElement) => { this.popperElement = el },
    referenceElement: (el: HTMLElement | ReactInstance) => { this.referenceElement = el },
  }

  state = {
    visible: false,
  }

  renderElement() {
    const visible = this.props.hoverMode
      ? this.state.visible
      : this.props.visible

    return (
      <div
        className={classnames('popper', this.props.className, {
          '-hidden': !visible,
        })}
        ref={this.$refs.popperElement}
        onMouseOver={this.onmouseover}
        onMouseLeave={this.onmouseleave}
      >
        <div className="arrow"></div>
        {this.props.popper}
      </div>
    )
  }

  render() {
    return React.cloneElement(React.Children.only(this.props.children), {
      ref: this.$refs.referenceElement,
    })
  }

  popperDidMount() {
    const referenceElement = ReactDOM.findDOMNode(this.referenceElement)

    this.popper = new Popperjs(referenceElement, this.popperElement, {
      placement: this.props.placement as any,
      modifiers: {
        arrow: {
          element: '.arrow',
        },
      },
    })

    if (this.props.hoverMode) {
      referenceElement.addEventListener('mouseover', this.onmouseover)
      referenceElement.addEventListener('mouseleave', this.onmouseleave)
    }
  }

  popperDidUpdate() {
    this.popper.update()
  }

  onmouseover = () => {
    clearTimeout(this.leaveTimer)

    this.enterTimer = window.setTimeout(() => {
      this.setState({
        visible: true,
      })
    }, 200)
  }

  onmouseleave = () => {
    clearTimeout(this.enterTimer)

    this.leaveTimer = window.setTimeout(() => {
      this.setState({
        visible: false,
      })
    }, 200)
  }

  static defaultProps = {
    placement: 'bottom',
  }
}
