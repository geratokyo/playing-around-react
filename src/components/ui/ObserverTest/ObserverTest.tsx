import * as React from 'react';

export interface ObserverTestProps {
    className?: string;
}

export interface ObserverTestState {
    numSteps: any;
    boxElement: any;
    prevRatio: any;
    decreasingColor: any;
    increasingColor: any;
}

export class ObserverTest extends React.Component<ObserverTestProps, ObserverTestState>{
    el: HTMLDivElement;
    constructor(p: ObserverTestProps) {
        super(p);
        this.state = {
            numSteps: 20.0,
            boxElement: null,
            prevRatio: 0.0,
            increasingColor: "rgba(40, 40, 190, ratio)",
            decreasingColor: "rgba(190, 40, 40, ratio)",
        }
    }

    componentDidMount() {
        // Set things up
        window.addEventListener("load", (event) => {
            this.setState({
                boxElement: document.querySelector("#box")
            })

            this.createObserver();
        }, false);
    }

    createObserver = () => {
        let observer;

        let options = {
            root: null,
            rootMargin: "0px",
            threshold: this.buildThresholdList()
        };

        observer = new IntersectionObserver(this.handleIntersect, options);
        observer.observe(this.state.boxElement);
    }

    buildThresholdList = () => {
        let thresholds = [];
        let numSteps = 20;

        for (let i = 1.0; i <= numSteps; i++) {
            let ratio = i / numSteps;
            thresholds.push(ratio);
        }

        thresholds.push(0);
        return thresholds;
    }

    handleIntersect = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.intersectionRatio > this.state.prevRatio) {
                entry.target.style.backgroundColor = this.state.increasingColor.replace("ratio", entry.intersectionRatio);
            }
            this.setState({
                prevRatio: entry.intersectionRatio
            })
        });

    }


    render() {
        const { props, state } = this,
            cls = this.props.className || "";

            console.log(state)
        return (
            <div id="box">
                <div className="vertical">
                    Welcome to <strong>The Box!</strong>
                </div>
            </div>
        )
    }
}
