import { iTooltipElement } from "./Types";


export function showtooltip(x, y, parentId) {
    let parentTop = document.getElementById(parentId).getBoundingClientRect().top;
    let parentLeft = document.getElementById(parentId).getBoundingClientRect().left;
    let top = y - parentTop;
    let left = x - parentLeft;

    return {
        istooltipVisible: true,
        tooltipX: left,
        tooltipY: top
    }
}

export function getElements(ev, elClass) {
    // current target vars(parent)
    let cTarget = ev.currentTarget as any;
    let cClass = cTarget.nodeName !== "DIV" ? cTarget.className.baseVal : cTarget.className;
    let cId = cTarget.id;

    //target vars (trigger element)
    let target = ev.target as any;
    let tClass = target.nodeName !== "DIV" ? target.className.baseVal : target.className;
    let tId = target.id;

    //list of interactive elements
    let interEls = document.getElementsByClassName(elClass);

    // target element is a valid interactive element or not
    let isValidLoc = tClass.indexOf(elClass) !== -1;

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

export function setTooltipStyles(tooltip: iTooltipElement, tlpX: number, tlpY: number) {
    let fnTop = tooltip.height ? Math.round(tlpY - tooltip.top - tooltip.height) : Math.round(tlpY - tooltip.top);
    let fnLeft = tooltip.width ? Math.round(tlpX - tooltip.left + tooltip.width / 2) : Math.round(tlpX - tooltip.left);

    var fnTlpStyles = tooltip.cursorBased === true ? {
        height: `${tooltip.height ? tooltip.height + "px" : "auto"}`,
        width: `${tooltip.width ? tooltip.width + "px" : "auto"}`,
        top: `${tooltip.top ? fnTop : Math.round(tlpY - 50)}px`, // - height/10
        left: `${tooltip.left ? fnLeft : Math.round(tlpX - 25)}px`, // - width/2
        transition: `${tooltip.transition ? tooltip.transition : "none"}`,
    } :
        {// DISPLAY TOOLTIP ON TOP OF ACTIVE AREA INSTEAD OF RANDOM.. THIS DOESNT WORK BUT SHOULD TRY WITH requestAnimationFrame().. BECAUSE IT GETS PREVIOUS HEIGHT OF TOOLTIP INSTEAD OF CURRENT
            // var prtH = document.getElementById(this.svgId).getBoundingClientRect().height;
            // var prtY = document.getElementById(this.svgId).getBoundingClientRect().y;
            // var prtW = document.getElementById(this.svgId).getBoundingClientRect().width;
            // var prtX = document.getElementById(this.svgId).getBoundingClientRect().x;
            // var locY = document.getElementById(this.state.hlgtLoc).getBoundingClientRect().y;
            // var locX = document.getElementById(this.state.hlgtLoc).getBoundingClientRect().x;
            // var tlpH = document.getElementById('map-tooltip').getBoundingClientRect().height;
            // console.log("elH: ", locY, "elW: ", locX);
            // this.tooltipStyles = {
            //     ...this.tooltipStyles,
            //     top: `${this.props.tooltip.top ? Math.round(this.state.tooltipY - this.props.tooltip.top) : Math.round(locY - prtY - tlpH)}px`, // - height/10
            //     left: `${this.props.tooltip.left ? Math.round(this.state.tooltipX - this.props.tooltip.left) : Math.round(locX - prtX)}px`, // - width/2
            // }
        }
    return fnTlpStyles;
}

export function setClickedStyles(elsArr, styles, hasHover) {
    var iEls = elsArr.interEls;
    var elId = elsArr.tId;

    for (var i = 0; i < iEls.length; i++) {
        var itemId = iEls[i].id;
        if (styles["click"]["transition"]) {
            iEls[i].style["transition"] = styles['click']["transition"];
        }
        if (itemId !== elId) {
            iEls[i].style[styles['click']['attr']] = styles['click']["valueDisabled"];
        } else {
            iEls[i].style[styles['click']["attr"]] = styles['click']["valueEnabled"];
        }

        if (hasHover && (itemId !== elId)) {
            iEls[i].style[styles['mousemove']["attr"]] = styles['mousemove']["valueDisabled"];
        }
    }
}


export function setHoverStyles(elsArr, styles, hasClick, currEl) {
    var iEls = elsArr.interEls;
    var elId = elsArr.tId;

    for (var i = 0; i < iEls.length; i++) {
        var itemId = iEls[i].id;

        if (styles["mousemove"]["transition"]) {
            iEls[i].style["transition"] = styles['mousemove']["transition"];
        }

        // performance boost if you have on variable for iEls[i].style[styles['mousemove']["attr"]] 
        let localElement = iEls[i].style[styles['mousemove']["attr"]];
        if (hasClick === false) {
            if (itemId !== elId) {
                localElement = styles['mousemove']["valueDisabled"];
            } else {
                localElement = styles['mousemove']["valueEnabled"];
            }
        } else {
            if (itemId !== elId || (elId !== currEl && currEl !== "")) {
                localElement = styles['mousemove']["valueDisabled"];
            }
            if (itemId == elId) {
                localElement = styles['mousemove']["valueEnabled"];
            }
            if (itemId == currEl) {
                iEls[i].style[styles['click']["attr"]] = styles['click']["valueEnabled"];
            }
        }
    }
}

export function setDefaultStyles(elsArr, styles, keepClick, currEl) {
    if (keepClick === false) {
        for (var i = 0; i < elsArr.length; i++) {
            elsArr[i].style[styles['click']["attr"]] = styles['click']["valueDefault"];
        }
    } else {
        for (var i = 0; i < elsArr.length; i++) {
            var itemId = elsArr[i].id;
            if (itemId !== currEl) {
                elsArr[i].style[styles['mousemove']["attr"]] = styles['mousemove']["valueDefault"]
            } else {
                elsArr[i].style[styles['click']["attr"]] = styles['click']["valueEnabled"]
            }
        }
    }
}

