import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export const notyf = new Notyf({
  duration: 2600,
  dismissible: true,
  position: {
    x: "right",
    y: "top",
  },
});
