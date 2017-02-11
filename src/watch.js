const { h } = require("preact");
const { Provider } = require("preact-redux");
import init from "./init";
import { CompleteGame } from "./view/CompleteGame";

init(store => {
    const id = window.location.search.replace("?id=", "");
    store.dispatch({ type: "load", id });
    return h(Provider, { store }, [h(CompleteGame)]);
});
