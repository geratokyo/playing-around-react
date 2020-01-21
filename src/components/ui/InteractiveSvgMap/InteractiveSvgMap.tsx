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

    //tooltip
    tooltip?: itooltipElement;

    //styles
    stylesMod: Dictionary<iStylesMod>;

    //funcs
    onStateChange: (e: any) => void;
    customOnClick: (any) => any;
}

export interface InteractiveSvgMapState {
    parentId: string;
    hlgtLoc: string;
    istooltipVisible: boolean;
    actionInEl: boolean;
    tooltipX: number;
    tooltipY: number;
}

export class InteractiveSvgMap extends React.Component<InteractiveSvgMapProps, InteractiveSvgMapState>{
    el: HTMLDivElement;
    tooltipStyles: any;
    constructor(p: InteractiveSvgMapProps) {
        super(p);
        this.state = {
            parentId: "",
            hlgtLoc: "",
            istooltipVisible: false,
            actionInEl: false,
            tooltipX: 0,
            tooltipY: 0,
        }
    }

    componentDidMount() {
        var svgId = this.props.svgImg.props.id;
        this.setState({
            parentId: svgId
        });

        this.tooltipStyles = {
            height: `${this.props.tooltip.height ? this.props.tooltip.height + "px" : "auto"}`,
            width: `${this.props.tooltip.width ? this.props.tooltip.width + "px" : "auto"}`,
        }

        if ((this.props.eventType == 'click' || this.props.eventType == 'click|mousemove') && this.props.isInteractive) {
            document.addEventListener('click', (ev) => this.handleOutOfBounds(ev, this.state.parentId));
        }
    }

    componentDidUpdate(prevProps: InteractiveSvgMapProps, prevState: InteractiveSvgMapState) {
        if (this.props.isInteractive) {
            if ((prevState.tooltipX !== this.state.tooltipX) || (prevState.tooltipY !== this.state.tooltipY)) {
                this.tooltipStyles = this.props.tooltip.cursorBased ? {
                    ...this.tooltipStyles,
                    top: `${this.props.tooltip.top ? Math.round(this.state.tooltipY - this.props.tooltip.top) : Math.round(this.state.tooltipY - 50)}px`, // - height/10
                    left: `${this.props.tooltip.left ? Math.round(this.state.tooltipX - this.props.tooltip.left) : Math.round(this.state.tooltipX - 25)}px`, // - width/2
                } :
                    {}
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
                    hlgtLoc: els.tId,
                });

                //apply styles for each element
                forEach(els.interEls, item => {
                    item.id !== els.tId ? item.style[this.props.stylesMod['click']["attr"]] = this.props.stylesMod['click']["valueDisabled"] : item.style[this.props.stylesMod['click']["attr"]] = this.props.stylesMod['click']["valueEnabled"];
                    if (hasHover) {
                        item.id !== els.tId ? item.style[this.props.stylesMod['mousemove']["attr"]] = this.props.stylesMod['mousemove']["valueDisabled"] : "";
                    }
                });

                if (this.props.tooltip) {
                    this.showtooltip(ev.clientX, ev.clientY, this.state.parentId);
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
                        hlgtLoc: els.tId,
                    });
                }

                //apply styles for each element
                forEach(els.interEls, item => {
                    if (hasClick === false) {
                        item.id !== els.tId ? item.style[this.props.stylesMod['mousemove']["attr"]] = this.props.stylesMod['mousemove']["valueDisabled"] : item.style[this.props.stylesMod['mousemove']["attr"]] = this.props.stylesMod['mousemove']["valueEnabled"];
                        if (this.props.tooltip) {
                            this.showtooltip(ev.clientX, ev.clientY, this.state.parentId);
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

    showtooltip = (x, y, parentId) => {
        let parentTop = document.getElementById(parentId).getBoundingClientRect().top;
        let parentLeft = document.getElementById(parentId).getBoundingClientRect().left;
        let top = y - parentTop;
        let left = x - parentLeft;

        this.setState({
            istooltipVisible: true,
            tooltipX: left,
            tooltipY: top
        })
    }

    clearEffect = (ev, keepClicked: boolean, eventType?) => {
        if (this.props.isInteractive) {
            if (keepClicked === false) {
                this.setState({
                    hlgtLoc: "",
                    istooltipVisible: false
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
        document.removeEventListener(this.props.eventType, (ev) => this.handleOutOfBounds(ev, this.state.parentId));
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
                    props.tooltip.element ?
                        <div
                            id="map-tooltip"
                            className={"map-tooltip " + cls + (!state.istooltipVisible ? "hide" : "map-tooltip--shown")}
                            style={this.tooltipStyles}
                        >
                            {props.tooltip.element}
                        </div>
                        :
                        ""
                }
                {/* <p>{state.hlgtLoc}</p> */}
            </div >
        )
    }
}

interface Dictionary<T> {
    [idx: string]: T;
}
interface iStylesMod {
    attr: string;
    valueEnabled: string;
    valueDisabled: string;
    valueDefault: string;
}
interface itooltipElement {
    height?: number;
    width?: number;
    top?: number;
    left?: number;
    cursorBased?: boolean;
    element?: React.ReactElement;
}