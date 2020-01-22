import * as React from 'react';
import { iTooltipElement, iStylesMod, Dictionary } from './Types';
import { showtooltip, getElements, setTooltipStyles, setClickedStyles, setHoverStyles, setDefaultStyles } from './helpers';

export interface InteractiveSvgMapProps {
    className?: string;
    id: string;

    //the svg element
    svgImg: any;

    // whether is interactive or not
    isInteractive: boolean;

    //type of event 
    eventType: 'click' | 'mousemove' | 'click|mousemove';

    //interactive elements classname
    interChildCls: string;

    //tooltip data(markup, positioning and dimensions)
    tooltip?: iTooltipElement;

    //styles for interactive elements
    stylesMod: Dictionary<iStylesMod>;

    //funcs
    // do something when there is interaction
    onStateChange: (e: any) => void;
    //custom func on interaction (i think its the same with above)
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

        if ((this.props.eventType == 'click' || this.props.eventType == 'click|mousemove') && this.props.isInteractive === true) {
            document.addEventListener('click', (ev) => this.handleOutOfBounds(ev, this.state.parentId));
        }
    }

    componentDidUpdate(prevProps: InteractiveSvgMapProps, prevState: InteractiveSvgMapState) {
        if (this.props.isInteractive === true) {
            if ((prevState.tooltipX !== this.state.tooltipX) || (prevState.tooltipY !== this.state.tooltipY)) {
                this.tooltipStyles = setTooltipStyles(this.props.tooltip, this.state.tooltipX, this.state.tooltipY);
            }
        }
    }

    handleClick = (ev, hasHover: boolean) => {
        var els = getElements(ev, this.props.interChildCls);

        if (els.isValidLoc && this.state.hlgtLoc !== els.tId) {
            this.props.onStateChange(els.tId); //pass current id to parent component
            this.setState({
                hlgtLoc: els.tId,
            });

            //apply styles for each element
            setClickedStyles(els, this.props.stylesMod, hasHover);

            if (this.props.tooltip) {
                this.setState(showtooltip(ev.clientX, ev.clientY, this.state.parentId));
            }
        } else {
            this.props.onStateChange("");
            this.clearEffect(ev, false);
        }
    }

    handleHover = (ev, hasClick: boolean) => {
        var els = getElements(ev, this.props.interChildCls);

        if (els.isValidLoc) {
            if (hasClick === false) {
                this.props.onStateChange(els.tId); //pass current id to parent component
                this.setState({
                    hlgtLoc: els.tId,
                });
            }

            //apply styles for each element
            setHoverStyles(els, this.props.stylesMod, hasClick, this.state.hlgtLoc);

            if (this.props.tooltip && hasClick === false) {
                this.setState(showtooltip(ev.clientX, ev.clientY, this.state.parentId));
            }
        } else {
            if (hasClick === false) {
                this.props.onStateChange("");
                this.clearEffect(ev, false);
            } else {
                this.clearEffect(ev, true);
            }
        }
    }

    // Check if event happened inside the parent element or outside
    handleOutOfBounds = (ev, elId: string) => {
        var svgMap = document.getElementById(elId);
        var actionInEl = svgMap.contains(ev.target) && (svgMap !== ev.target);

        this.setState({
            actionInEl
        })

        if (!actionInEl) {
            this.clearEffect(ev, false);
        }
    }

    clearEffect = (ev, keepClicked: boolean) => {
        if (keepClicked === false) {
            this.setState({
                hlgtLoc: "",
                istooltipVisible: false
            });
            this.props.onStateChange("");
        }

        let interEls = document.getElementsByClassName(this.props.interChildCls);
        setDefaultStyles(interEls, this.props.stylesMod, keepClicked, this.state.hlgtLoc);
    }

    onClick = (ev, evType) => {
        if (this.props.isInteractive === true) {
            if (evType == 'click') {
                this.handleClick(ev, false);
            }
            if (evType == 'click|mousemove') {
                this.handleClick(ev, true);
            }
        }
    }

    onHover = (ev, evType) => {
        if (this.props.isInteractive === true) {
            if (evType == 'mousemove') {
                this.handleHover(ev, false);
            }
            if (evType == 'click|mousemove') {
                this.handleHover(ev, true);
            }
        }
    }

    onMouseOut = (ev, evType) => {
        if (this.props.isInteractive === true) {
            if (evType == 'mousemove') {
                this.clearEffect(ev, false);
            }
            if (evType == 'click|mousemove') {
                this.clearEffect(ev, true);
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
                onClick={(ev) => this.onClick(ev, this.props.eventType)}
                onMouseMove={(ev) => this.onHover(ev, this.props.eventType)}
                onMouseOut={(ev) => this.onMouseOut(ev, this.props.eventType)}
            >
                {
                    props.svgImg
                }
                {/* tooltip */}
                {
                    props.tooltip.element ?
                        <div
                            id="map-tooltip"
                            className={"map-tooltip " + (!state.istooltipVisible ? "map-tooltip--hidden " : "map-tooltip--shown ") + (props.tooltip.className || "")}
                            style={this.tooltipStyles}
                        >
                            {props.tooltip.element}
                        </div>
                        :
                        ""
                }
            </div >
        )
    }
}