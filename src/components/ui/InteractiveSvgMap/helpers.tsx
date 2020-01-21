
// DISPLAY TOOLTIP ON TOP OF ACTIVE AREA INSTEAD OF RANDOM.. THIS DOESNT WORK BUT SHOULD TRY WITH requestAnimationFrame().. BECAUSE IT GETS PREVIOUS HEIGHT OF TOOLTIP INSTEAD OF CURRENT
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