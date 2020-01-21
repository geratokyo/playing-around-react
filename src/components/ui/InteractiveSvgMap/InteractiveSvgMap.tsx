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
    interChildCls: string;
    interParentId: string;

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
    tooltipStyles;
    constructor(p: InteractiveSvgMapProps) {
        super(p);
        this.state = {
            hlgtLoc: "",
            isTooltipVisible: false,
            toolTipX: 0,
            toolTipY: 0,
            actionInEl: false,
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

    getElements = (ev) => {
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

        // target element is a valid interactive element or not
        let isValidLoc = tClass.indexOf(this.props.interChildCls) !== -1;

        return {
            cTarget,
            cClass,
            cId,
            target,
            tClass,
            tId,
            interEls,
            isValidLoc,
        }
    }

    handleClick = (ev: any, hasHover: boolean) => {
        if (this.props.isInteractive) {
            var els = this.getElements(ev);

            if (els.isValidLoc && this.state.hlgtLoc !== els.tId) {
                this.props.onStateChange(els.tId); //pass current id to parent component
                this.setState({
                    hlgtLoc: els.tId
                });

                //apply styles for each element
                forEach(els.interEls, item => {
                    item.id !== els.tId ? item.style[this.props.stylesMod['click']["attr"]] = this.props.stylesMod['click']["valueDisabled"] : item.style[this.props.stylesMod['click']["attr"]] = this.props.stylesMod['click']["valueEnabled"];
                    if (hasHover) {
                        item.id !== els.tId ? item.style[this.props.stylesMod['mousemove']["attr"]] = this.props.stylesMod['mousemove']["valueDisabled"] : "";
                    }
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

    handleHover = (ev: any, hasClick: boolean) => {
        if (this.props.isInteractive) {
            var els = this.getElements(ev);

            if (els.isValidLoc) {
                if (hasClick === false) {
                    this.props.onStateChange(els.tId); //pass current id to parent component
                    this.setState({
                        hlgtLoc: els.tId
                    });
                }

                //apply styles for each element
                forEach(els.interEls, item => {
                    if (hasClick === false) {
                        item.id !== els.tId ? item.style[this.props.stylesMod['mousemove']["attr"]] = this.props.stylesMod['mousemove']["valueDisabled"] : item.style[this.props.stylesMod['mousemove']["attr"]] = this.props.stylesMod['mousemove']["valueEnabled"];
                        if (this.props.tooltip) {
                            this.showToolTip(ev.clientX, ev.clientY, this.props.interParentId);
                        }
                    } else {
                        (item.id !== els.tId || (els.tId !== this.state.hlgtLoc && this.state.hlgtLoc !== "")) ? item.style[this.props.stylesMod['mousemove']["attr"]] = this.props.stylesMod['mousemove']["valueDisabled"] : "";
                        item.id == els.tId ? item.style[this.props.stylesMod['mousemove']["attr"]] = this.props.stylesMod['mousemove']["valueEnabled"] : "";
                        item.id == this.state.hlgtLoc ? item.style[this.props.stylesMod['click']["attr"]] = this.props.stylesMod['click']["valueEnabled"] : "";
                    }
                });

            } else {
                if (hasClick === false) {
                    this.props.onStateChange("");
                    this.clearEffect(ev, false, 'mousemove');
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
                this.props.onStateChange("");
            }

            if (keepClicked === false) {
                forEach(document.getElementsByClassName(this.props.interChildCls), item => (
                    item.style[this.props.stylesMod['click']["attr"]] = this.props.stylesMod['click']["valueDefault"]
                ))
            } else {
                forEach(document.getElementsByClassName(this.props.interChildCls), item => (
                    item.id !== this.state.hlgtLoc ? item.style[this.props.stylesMod['mousemove']["attr"]] = this.props.stylesMod['mousemove']["valueDefault"] : item.style[this.props.stylesMod['click']["attr"]] = this.props.stylesMod['click']["valueEnabled"]
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
                onClick={props.eventType == 'click' ? (ev) => this.handleClick(ev, false) : props.eventType == 'click|mousemove' ? (ev) => this.handleClick(ev, true) : null}
                onMouseMove={props.eventType == 'mousemove' ? (ev) => this.handleHover(ev, false) : props.eventType == 'click|mousemove' ? (ev) => this.handleHover(ev, true) : null}
                onMouseOut={props.eventType == 'mousemove' ? (ev) => this.clearEffect(ev, false) : props.eventType == 'click|mousemove' ? (ev) => this.clearEffect(ev, true) : null}
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