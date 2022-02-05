import React, { CSSProperties } from 'react'
import { ContentUtils } from '../../../utils'
import DropDown from '../../common/DropDown'
import BuiltinColorPicker from '../../common/ColorPicker'
import './style.scss'
import { MdFormatColorText } from 'react-icons/md'
import { defaultIconProps } from '../../../configs/props'

class TextColor extends React.Component<any, any> {
  state = {
    colorType: 'color'
  };

  dropDownInstance = React.createRef<any>();

  switchColorType = ({ currentTarget }) => {
    this.setState({
      colorType: currentTarget.dataset.type
    })
  };

  toggleColor = (color, closePicker) => {
    if (color) {
      let newColor = color
      const hookReturns = this.props.hooks(
        `toggle-text-${this.state.colorType}`,
        newColor
      )(newColor)

      if (hookReturns === false) {
        return false
      }

      if (typeof hookReturns === 'string') {
        newColor = hookReturns
      }

      if (this.state.colorType === 'color') {
        this.props.editor.setValue(
          ContentUtils.toggleSelectionColor(this.props.editorState, newColor)
        )
      } else {
        this.props.editor.setValue(
          ContentUtils.toggleSelectionBackgroundColor(
            this.props.editorState,
            newColor
          )
        )
      }
    }

    if (closePicker) {
      this.dropDownInstance.current?.hide()
      this.props.editor.requestFocus()
    }
    return true
  };

  render () {
    const captionStyle: CSSProperties = {}
    let currentColor = null
    const { colorType } = this.state

    const selectionStyles = this.props.editorState
      .getCurrentInlineStyle()
      .toJS()

    selectionStyles.forEach((style) => {
      if (style.indexOf('COLOR-') === 0) {
        captionStyle.color = `#${style.split('-')[1]}`
        if (colorType === 'color') {
          currentColor = captionStyle.color
        }
      }

      if (style.indexOf('BGCOLOR-') === 0) {
        captionStyle.backgroundColor = `#${style.split('-')[1]}`
        if (colorType === 'background-color') {
          currentColor = captionStyle.backgroundColor
        }
      }
    })

    const caption = <MdFormatColorText {...defaultIconProps} style={captionStyle} />

    const ColorPicker = this.props.colorPicker || BuiltinColorPicker

    return (
      <DropDown
        caption={caption}
        title={this.props.language.controls.color}
        showArrow={false}
        autoHide={this.props.autoHide}
        theme={this.props.theme}
        getContainerNode={this.props.getContainerNode}
        ref={this.dropDownInstance}
        className="control-item dropdown text-color-dropdown"
      >
        <div className="bf-text-color-picker-wrap">
          <div
            className="bf-color-switch-buttons"
            style={this.props.enableBackgroundColor ? {} : { display: 'none' }}
          >
            <button
              type="button"
              data-type="color"
              className={colorType === 'color' ? 'active' : ''}
              onClick={this.switchColorType}
            >
              {this.props.language.controls.textColor}
            </button>
            <button
              type="button"
              data-type="background-color"
              className={colorType === 'background-color' ? 'active' : ''}
              onClick={this.switchColorType}
            >
              {this.props.language.controls.backgroundColor}
            </button>
          </div>
          <ColorPicker
            width={200}
            color={currentColor}
            disableAlpha
            presetColors={this.props.colors}
            onChange={this.toggleColor}
          />
        </div>
      </DropDown>
    )
  }
}

export default TextColor
