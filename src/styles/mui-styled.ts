import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

//////// <Authentication /> styles

export const AuthenticationInput = styled(TextField)(() => ({
  backgroundColor: "var(--color-background-light)",
  borderRadius: "3px",

  width: "100%",
  fontSize: "16px",

  ".MuiInputLabel-root": {
    color: "var(--color-text-dark)",
  },

  ".MuiFilledInput-root": {
    "::after": {
      borderBottomColor: "var(--base-yellow)",
      borderBottomWidth: "4px",
    },
  },
}));
