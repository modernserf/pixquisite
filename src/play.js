const h = require("react-hyperscript");
const { Provider } = require("react-redux");
import init from "./init";
import { ActiveGame } from "./view/ActiveGame";

// import { CompleteGame } from "./CompleteGame";

init(store => h(Provider, { store }, [h(ActiveGame)]));
