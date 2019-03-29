// src/ui/theme/index.js

import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
  primary: { main: '#a50000' },
  secondary: { main: '#3E2723' }
};
const themeName = 'Bright Red English Walnut Emu';

export default createMuiTheme({ palette, themeName });

