import Color from 'color';

export function muteColor(color, amount = 0.5) {
  return Color(color)
    .mix(Color('#fff'), amount)
    .hex();
}

const variables = {
  colors: {
    primary: '#003B5C',
    success: '#A1D884',
    get successMuted() {
      return muteColor(this.success);
    },
    info: '#71C5E8',
    get infoMuted() {
      return muteColor(this.info);
    },
    warning: '#FFB25B',
    get warningMuted() {
      return muteColor(this.warning);
    },
    danger: '#FF4C39',
    get text() {
      return this.primary;
    },
    lightTitle: '#ABAEBA',
    textMuted: '#6C728A',
    background: '#F5F4F0',
    border: '#E7E7E7',
  },
  fonts: {
    primary: 'Atlas Grotesk',
    secondary: 'Tiempos Headline',
  },
};

export default variables;
