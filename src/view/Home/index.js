import React from "react";
import { Link } from "redux-antirouter";
import "./style.css";

export function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1 className="home-title">Pixquisite Corpse</h1>
                <p className="home-tagline">A Tagline Goes Here™</p>
            </header>
            <section>
                <div className="home-example">
                    TODO: an example animation
                </div>
                <div className="play-link-wrap">
                    <Link action={{ type: "toPlay" }} className="play-link">
                        Play!
                    </Link>
                </div>
            </section>
            <section className="credits">
                <h2 className="credits-header">Credits</h2>
                <p>
                    Made by{" "}
                    <a href="http://justinfalcone.com/">Justin Falcone</a>
                    .
                </p>
                <p>
                    Inspired by{" "}
                    <a href="https://github.com/Will-Sommers/draw-me">
                        draw-me
                    </a>
                    {" "}by Will Sommers.
                </p>
            </section>
            <a
                href="https://github.com/modernserf/pixquisite"
                className="github-link"
            >
                <img
                    src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67"
                    alt="Fork me on GitHub"
                    data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
                />
            </a>
        </div>
    );
}
