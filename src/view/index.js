import h from "react-hyperscript";
import { Provider, connect } from "react-redux";

import "./reset.css";
import "./style.css";
import "./home.css";
import { ActiveGame } from "./ActiveGame";
import { CompleteGame } from "./CompleteGame";

const routes = [
    { route: "play", component: ActiveGame },
    { route: "view", component: CompleteGame }
];

const Router = connect(state => state.route)(({ path }) => {
    const route = path[0];
    const Component = routes.find(r => r.route === route).component;
    return h(Component);
});

export default function App(store) {
    return h(Provider, { store }, [h(Router)]);
}
