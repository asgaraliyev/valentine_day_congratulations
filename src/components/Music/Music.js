/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');

class Music extends BaseComponent {
  constructor(props) {
    super(props);
  }

  toggle (state) {
    if (state === false) {
      try {
        this.audioEl.play();
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    } else {
      this.audioEl.pause();
    }
  }

  componentWillUpdate(props) {
    this.toggle(props.isMuted);
  }

  render () {
    return (
      <audio
        ref={c => { this.audioEl = c; }}
        loop
        preload='auto'
        volume='1'
      >
        <source src='assets/sound/off-color-outtro.mp3' type='audio/mpeg'/>
        <source src='assets/sound/off-color-outtro.ogg' type='audio/ogg'/>
      </audio>
    )
  }
}

module.exports = Music;