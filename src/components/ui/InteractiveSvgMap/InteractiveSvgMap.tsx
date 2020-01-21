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
    currEvent: '' | 'click' | 'mousemove';
    keepLast: boolean;

}

export class InteractiveSvgMap extends React.Component<InteractiveSvgMapProps, InteractiveSvgMapState>{
    el: HTMLDivElement;
    hlgtLoc; // location id - this will be updated with the state so it can be used outside of the component
    hlgtMap; // mapId - this will be updated with the state so it can be used outside of the component
    tooltipStyles;
    evTypes;
    constructor(p: InteractiveSvgMapProps) {
        super(p);
        this.state = {
            hlgtLoc: "",
            isTooltipVisible: false,
            toolTipX: 0,
            toolTipY: 0,
            actionInEl: false,
            currEvent: '',
            keepLast: false
        }
    }

    componentDidMount() {
        if ((this.props.eventType == 'click' || this.props.eventType == 'click|mousemove') && this.props.isInteractive) {
            document.addEventListener('click', (ev) => this.handleOutOfBounds(ev, this.props.interParentId));
        }

        this.tooltipStyles = {
            top: `${Math.round(this.state.toolTipY) - 50 - 10}px`,
            left: `${Math.round(this.state.toolTipX) - 50 / 2}px`,
        }

        this.evTypes = this.props.eventType.split("|");
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
                this.clearEffect(ev, false, 'click');
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
                this.clearEffect(ev, false, 'mousemove');
            }
        }
    }

    handleBoth = (ev) => {
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

            var clickedEl;

            if (ev.type == 'click') {
                if (isValidLoc) {
                    this.props.onStateChange(tId); //pass current id to parent component
                    this.setState({
                        hlgtLoc: tId,
                        currEvent: 'click',
                    });

                    clickedEl = tId;

                    //apply styles for each element
                    forEach(interEls, item => {
                        item.id !== tId ? item.style[this.props.stylesMod[ev.type]["attr"]] = this.props.stylesMod[ev.type]["valueDisabled"] : item.style[this.props.stylesMod[ev.type]["attr"]] = this.props.stylesMod[ev.type]["valueEnabled"];
                        item.id !== tId ? item.style[this.props.stylesMod['mousemove']["attr"]] = this.props.stylesMod['mousemove']["valueDisabled"] : "";
                    });

                    if (this.props.tooltip) {
                        this.showToolTip(ev.clientX, ev.clientY, this.props.interParentId);
                    }
                } else {
                    this.props.onStateChange("");
                    this.clearEffect(ev, false, 'click');
                }
            }

            if (ev.type == 'mousemove') {
                if (isValidLoc) {
                    this.setState({
                        currEvent: 'mousemove'
                    });

                    forEach(interEls, item => {
                        (item.id !== tId || (tId !== this.state.hlgtLoc && this.state.hlgtLoc !== "")) ? item.style[this.props.stylesMod[ev.type]["attr"]] = this.props.stylesMod[ev.type]["valueDisabled"] : "";
                        item.id == tId ? item.style[this.props.stylesMod[ev.type]["attr"]] = this.props.stylesMod[ev.type]["valueEnabled"] : "";
                        item.id == this.state.hlgtLoc ? item.style[this.props.stylesMod['click']["attr"]] = this.props.stylesMod['click']["valueEnabled"] : "";
                    });

                    if (this.props.tooltip) {
                        this.showToolTip(ev.clientX, ev.clientY, this.props.interParentId);
                    }
                } else {
                    this.clearEffect(ev, true, 'mousemove');
                }
            }

        }
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
                this.clearEffect(ev, false, 'click');
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

    clearEffect = (ev, keepClicked: boolean, eventType?) => {
        if (this.props.isInteractive) {
            let evType = eventType ? eventType : this.props.eventType;

            if (keepClicked === false) {
                this.setState({
                    hlgtLoc: "",
                    isTooltipVisible: false
                });
                this.props.onStateChange("")
            } else {
                this.setState({
                    isTooltipVisible: false
                })
            }


            if (keepClicked === false) {
                forEach(document.getElementsByClassName(this.props.interChildCls), item => (
                    item.style[this.props.stylesMod[evType]["attr"]] = this.props.stylesMod[evType]["valueDefault"]
                ))
            } else {
                forEach(document.getElementsByClassName(this.props.interChildCls), item => (
                    item.id !== this.state.hlgtLoc ? item.style[this.props.stylesMod[evType]["attr"]] = this.props.stylesMod[evType]["valueDefault"] : ""
                ));
            }
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
                onMouseOut={props.eventType == 'mousemove' ? (ev) => this.clearEffect(ev, false) : null}
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
                {/* <p>{state.hlgtLoc}</p> */}
            </div >
        )
    }
}