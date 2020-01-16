import * as React from 'react';

export interface InteractiveSvgMapProps {
    className?: string;
    svgImg: any;
    hoverableChild?: any;
    hoverableParent?: any;
}

export interface InteractiveSvgMapState {
    hCountry: string;
    hContinent: string;
    isTooltipVisible: boolean;
    toolTipX: number;
    toolTipY: number;
}

export class InteractiveSvgMap extends React.Component<InteractiveSvgMapProps, InteractiveSvgMapState>{
    el: HTMLDivElement;
    constructor(p: InteractiveSvgMapProps) {
        super(p);
        this.state = {
            hCountry: "",
            hContinent: "",
            isTooltipVisible: false,
            toolTipX: 0,
            toolTipY: 0
        }
    }

    attachId = (el) => {
        console.log(el)
    }


    render() {
        const { props, state } = this,
            cls = this.props.className || "";

        return (
            <div className={"interactive-svg-map " + cls} ref={e => this.el = e}>
                {
                    props.svgImg
                }
            </div>
        )
    }
}
