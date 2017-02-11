const { h } = require("preact");
const { Provider } = require("preact-redux");
import init from "./init";
import { ActiveGame } from "./view/ActiveGame";

init(store => h(Provider, { store }, [h(ActiveGame)]));
