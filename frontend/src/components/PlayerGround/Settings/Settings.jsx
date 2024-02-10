import React from 'react';
import Slider from '@mui/material/Slider';

import './Settings.css';

const Settings = (props) => {

  return (
    <div className="settings_container">
        <div className="translate_button_container">
            <div className='vertical_container'>
                <div className='translate_button' onClick={() => props.onChangePosition('up')}>
                    <span className="material-icons">
                        expand_less
                        </span>
                </div>
            </div>
            <div className='horizontal_container'>
                <div className='translate_button' onClick={() => props.onChangePosition('left')}>
                    <span className="material-icons">
                        navigate_before
                        </span>
                </div>
                {/* adjusting the poisition back to the original */}
                <div className='translate_button' onClick={() => props.onChangePosition('return')}>
                    <span className="material-icons">
                        cached
                    </span>
                </div>
                <div className='translate_button' onClick={() => props.onChangePosition('right')}>
                    <span className="material-icons">
                        navigate_next
                        </span>
                </div>
            </div>
            <div className='vertical_container'>
                <div className='translate_button' onClick={() => props.onChangePosition('down')}>
                    <span className="material-icons">
                        expand_more
                        </span>
                </div>
            </div>
        </div>
        <div className="size_button" onClick={() => props.onChangeSize('increase')}>
            <span className="material-icons">
                add
                </span>
        </div>
        <div className="size_button" onClick={() => props.onChangeSize('decrease')}>
            <span className="material-icons">
                remove
                </span>
        </div>
        <div className="slider_container">
            <Slider
                orientation="vertical"
                defaultValue={45}
                aria-labelledby="vertical-slider"
                onChange={props.getTransformRotateXValue}
                max={80}
            />
        </div>

    </div>
  )
  }

export default Settings;
