import * as React from 'react';
import * as forEach from 'lodash.foreach';
export interface InteractiveSvgMapProps {
    className?: string;
    id: string;

    //the svg element
    svgImg: any;

    // whether is interactive or not
    isInteractive: boolean;

    //type of event 
    eventType: 'click' | 'mousemove' | 'click|mousemove';

    //interactive element classnames
    interChildCls?: string;
    interParentId?: string;

    //tooltip
    tooltip?: any;

    //styles
    stylesMod: any;

    //funcs
    onStateChange: (e: any) => void;
    customOnClick: (any) => any;
}

export interface InteractiveSvgMapState {
    hlgtLoc: string;
    isTooltipVisible: boolean;
    toolTipX: number;
    toolTipY: number;
    actionInEl: boolean;
}

export class InteractiveSvgMap extends React.Component<InteractiveSvgMapProps, InteractiveSvgMapState>{
    el: HTMLDivElement;
    hlgtLoc; // location id - this will be updated with the state so it can be used outside of the component
    hlgtMap; // mapId - this will be updated with the state so it can be used outside of the component
    tooltipStyles;
    constructor(p: InteractiveSvgMapProps) {
        super(p);
        this.state = {
            hlgtLoc: "",
            isTooltipVisible: false,
            toolTipX: 0,
            toolTipY: 0,
            actionInEl: false
        }
    }

    componentDidMount() {
        if (this.props.eventType == 'click' && this.props.isInteractive) {
            document.addEventListener(this.props.eventType, (ev) => this.handleOutOfBounds(ev, this.props.interParentId));
        }

        this.tooltipStyles = {
            top: `${Math.round(this.state.toolTipY) - 50 - 10}px`,
            left: `${Math.round(this.state.toolTipX) - 50 / 2}px`,
        }
    }

    componentDidUpdate(prevProps: InteractiveSvgMapProps, prevState: InteractiveSvgMapState) {
        if (this.props.isInteractive) {
            if ((prevState.toolTipX !== this.state.toolTipX) || (prevState.toolTipY !== this.state.toolTipY)) {
                this.tooltipStyles = {
                    top: `${Math.round(this.state.toolTipY) - 50 - 10}px`,
                    left: `${Math.round(this.state.toolTipX) - 50 / 2}px`,
                }
            }
        }
    }

    handleClick = (ev: any) => {
        if (this.props.isInteractive) {
            // current target vars(parent)
            let cTarget = ev.currentTarget as any;
            let cClass = cTarget.nodeName !== "DIV" ? cTarget.className.baseVal : cTarget.className;
            let cId = cTarget.id;

            //target vars (trigger element)
            let target = ev.target as any;
            let tClass = target.nodeName !== "DIV" ? target.className.baseVal : target.className;
            let tId = target.id;

            //list of interactive elements
            let interEls = document.getElementsByClassName(this.props.interChildCls);

            let isValidLoc = tClass.indexOf(this.props.interChildCls) !== -1;
            // let isContinent = tClass.indexOf("circles-svg") !== -1;

            if (isValidLoc && this.state.hlgtLoc !== tId) {
                this.props.onStateChange(tId); //pass current id to parent component
                this.setState({
                    hlgtLoc: tId
                });

                //apply styles for each element
                forEach(interEls, item => {
                    item.id !== tId ? item.style[this.props.stylesMod[this.props.eventType]["attr"]] = this.props.stylesMod[this.props.eventType]["valueDisabled"] : item.style[this.props.stylesMod[this.props.eventType]["attr"]] = this.props.stylesMod[this.props.eventType]["valueEnabled"];
                });

                if (this.props.tooltip) {
                    this.showToolTip(ev.clientX, ev.clientY, this.props.interParentId);
                }
            } else {
                this.props.onStateChange("");
                this.clearEffect(ev);
            }
        }

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

            //list of interactive elements
            let interEls = document.getElementsByClassName(this.props.interChildCls);

            let isValidLoc = tClass.indexOf(this.props.interChildCls) !== -1;
            // let isContinent = tClass.indexOf("circles-svg") !== -1;

            if (isValidLoc) {
                this.props.onStateChange(tId); //pass current id to parent component
                this.setState({
                    hlgtLoc: tId
                });

                //apply styles for each element
                forEach(interEls, item => {
                    item.id !== tId ? item.style[this.props.stylesMod[this.props.eventType]["attr"]] = this.props.stylesMod[this.props.eventType]["valueDisabled"] : item.style[this.props.stylesMod[this.props.eventType]["attr"]] = this.props.stylesMod[this.props.eventType]["valueEnabled"];
                });

                if (this.props.tooltip) {
                    this.showToolTip(ev.clientX, ev.clientY, this.props.interParentId);
                }
            } else {
                this.props.onStateChange("");
                this.clearEffect(ev);
            }
        }
    }

    handleBoth = (ev) => {

    }

    // Check if event happened inside the parent element or outside
    handleOutOfBounds = (ev, elId: string) => {
        if (this.props.isInteractive) {
            var svgMap = document.getElementById(elId);
            var actionInEl = svgMap.contains(ev.target) && (svgMap !== ev.target);

            this.setState({
                actionInEl
            })

            if (!actionInEl) {
                this.clearEffect(ev);
            }
        }
    }

    showToolTip = (x, y, parentId) => {
        let parentTop = document.getElementById(parentId).getBoundingClientRect().top;
        let parentLeft = document.getElementById(parentId).getBoundingClientRect().left;
        let top = y - parentTop;
        let left = x - parentLeft;

        this.setState({
            isTooltipVisible: true,
            toolTipX: left,
            toolTipY: top
        })
    }

    clearEffect = (ev, eventType?) => {
        if (this.props.isInteractive) {
            var evType = eventType ? eventType : this.props.eventType;

            this.setState({
                hlgtLoc: "",
                isTooltipVisible: false
            })

            forEach(document.getElementsByClassName(this.props.interChildCls), item => (
                item.style[this.props.stylesMod[evType]["attr"]] = this.props.stylesMod[evType]["valueDefault"]
            ))
        }
    }

    componentWillUnmount() {
        document.removeEventListener(this.props.eventType, (ev) => this.handleOutOfBounds(ev, this.props.interParentId));
    }

    render() {
        const { props, state } = this,
            cls = this.props.className || "";

        return (
            <div
                id={props.id}
                className={"interactive-svg-map " + cls}
                ref={e => this.el = e}
                onClick={props.eventType == 'click' ? (ev) => this.handleClick(ev) : props.eventType == 'click|mousemove' ? (ev) => this.handleBoth(ev) : null}
                onMouseMove={props.eventType == 'mousemove' ? (ev) => this.handleHover(ev) : props.eventType == 'click|mousemove' ? (ev) => this.handleBoth(ev) : null}
                onMouseOut={props.eventType == 'mousemove' || props.eventType == 'click|mousemove' ? (ev) => this.clearEffect(ev) : null}
            >
                {
                    props.svgImg
                }
                {/* tooltip */}
                {
                    props.tooltip ?
                        <div
                            className={"map-tooltip " + cls + (!state.isTooltipVisible ? "hide" : "map-tooltip--shown")}
                            style={this.tooltipStyles}
                        >
                            {props.tooltip}
                        </div>
                        :
                        ""
                }
                <p>{state.hlgtLoc}</p>
            </div >
        )
    }
}