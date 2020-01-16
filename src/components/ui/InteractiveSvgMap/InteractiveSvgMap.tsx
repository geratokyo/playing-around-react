import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface InteractiveSvgMapProps {
    className?: string;
    mapId: string;

    svgImg: any;
    isInteractive: boolean;
    hoverableChild?: any;
    hoverableParent?: any;
}

export interface InteractiveSvgMapState {
    hlgtLoc: string;
    hContinent: string;
    isTooltipVisible: boolean;
    toolTipX: number;
    toolTipY: number;
}

export class InteractiveSvgMap extends React.Component<InteractiveSvgMapProps, InteractiveSvgMapState>{
    el: HTMLDivElement;
    hlgtLoc; // this will be updated with the state so it can be used outside of the component
    constructor(p: InteractiveSvgMapProps) {
        super(p);
        this.state = {
            hlgtLoc: "",
            hContinent: "",
            isTooltipVisible: false,
            toolTipX: 0,
            toolTipY: 0
        }
    }

    componentDidMount() {
        console.log(this.props);
    }

    handleHover = (ev: any) => {
        if (this.props.isInteractive) {
            // current target vars(parent)
            let cTarget = ev.currentTarget as any;
            let cClass = cTarget.nodeName !== "DIV" ? cTarget.className.baseVal : cTarget.className;
            let cId = cTarget.id;

            //target vars (trigger element)
            let target = ev.target as any;
            let tClass = target.nodeName !== "DIV" ? target.className.baseVal : target.className;
            let tId = target.id;

            let isValidLoc = tClass.indexOf(this.props.hoverableChild) !== -1;
            // let isContinent = tClass.indexOf("circles-svg") !== -1;

            if (isValidLoc) {
                this.setState({
                    hlgtLoc: tId
                })
            }

        }
    }



    render() {
        const { props, state } = this,
            cls = this.props.className || "";

        console.log(state.hlgtLoc)
        return (
            <div
                id={props.mapId}
                className={"interactive-svg-map " + cls}
                ref={e => this.el = e}
                onClick={this.handleHover}
            // onMouseMove={}
            // onMouseOut={}
            >
                {
                    props.svgImg
                }

                <p>{state.hlgtLoc}</p>
            </div>
        )
    }
}


// highlightCountry = (ev: React.SyntheticEvent<any> | any) => {
//     if (SCREEN_WIDTH.IS_LARGE()) {
//         //current target vars (parent)
//         let cTarget = ev.currentTarget as any;
//         let cClass = cTarget.nodeName !== "DIV" ? cTarget.className.baseVal : cTarget.className;
//         let cId = cTarget.id;

//         //target vars (trigger element)
//         let target = ev.target as any;
//         let tClass = target.nodeName !== "DIV" ? target.className.baseVal : target.className;
//         let tId = target.id;

//         let isCountry = tClass.indexOf("country-circle") !== -1;
//         let isContinent = tClass.indexOf("circles-svg") !== -1;

//         if (isCountry) {
//             this.setState({
//                 hCountry: tId,
//                 hContinent: cId
//             });

//             forEach(document.getElementsByClassName(`country-circle`), item => {
//                 item.id !== tId ? item.style.opacity = 0.4 : item.style.opacity = 1;
//             })

//             this.showToolTip(ev.clientX, ev.clientY, "map-image");
//         }

//         if (isContinent) {
//             this.setState({
//                 hCountry: "",
//                 hContinent: cId
//             });
//         }

//         forEach(document.getElementsByClassName("circle-svg"), item => (
//             item.style.opacity = "0.8 !important"
//         ))
//     }
// }

// showToolTip = (x, y, parentId) => {
//     let parentTop = document.getElementById(parentId).getBoundingClientRect().top;
//     let parentLeft = document.getElementById(parentId).getBoundingClientRect().left;
//     let top = y - parentTop;
//     let left = x - parentLeft;

//     this.setState({
//         isTooltipVisible: true,
//         toolTipX: left,
//         toolTipY: top
//     })
// }