import { createMuiTheme } from "@material-ui/core/styles";

const typography = {
  useNextVariants: true
};
const palette = {
  primary: { main: "#3E2723" },
  secondary: { main: "#a50000" }
};

export default createMuiTheme({typography, palette});
