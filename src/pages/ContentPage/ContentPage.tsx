import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';

import { IStoreState } from '../../_reducers';
import { Translation } from '../../models/models';
import { ObserverTest } from '../../components/ui/ObserverTest/ObserverTest';
import { InteractiveSvgMap } from '../../components/ui/InteractiveSvgMap/InteractiveSvgMap';

export interface ContentPageProps extends ReactRedux.DispatchProp<any>, RouteComponentProps<any> {
    className?: string;
    locale: Translation;
}

const INIT_STATE: ContentPageState = {

}

export interface ContentPageState {

}

export class ContentPage extends React.Component<ContentPageProps, ContentPageState> {

    constructor(props: ContentPageProps) {
        super(props);
        this.state = INIT_STATE;
    }


    render() {
        const { props, state } = this;
        const cls = this.props.className || "";

        let testMap = <svg id="testMap" className="circles-svg circles-svg--europe animated zoomIn delay-1" version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <g id="europe-average" fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <circle className={"country-circle europe"} id="france" cx="200" cy="329" fill="#FF9703" r="50" />
                <circle className={"country-circle europe"} id="austria" cx="347" cy="301" fill="#FF8403" r="60" />
                <circle className={"country-circle europe"} id="switzerland" cx="272" cy="313" fill="#FF8403" r="60" />
                <circle className={"country-circle europe"} id="norway" cx="287" cy="86" fill="#FFCE03" r="20" />
                <circle className={"country-circle europe"} id="ireland" cx="96" cy="230" fill="#FFCE03" r="20" />
                <circle className={"country-circle europe"} id="italy" cx="337" cy="379" fill="#FFBC02" r="30" />
                <circle className={"country-circle europe"} id="netherlands" cx="240" cy="241" fill="#FF9703" r="50" />
                <circle className={"country-circle europe"} id="belgium" cx="220" cy="260" fill="#FFBC02" r="30" />
                <circle className={"country-circle europe"} id="luxembourg" cx="248" cy="279" fill="#FFBC02" r="30" />
                <circle className={"country-circle europe"} id="denmark" cx="287" cy="183" fill="#FFA903" r="40" />
                <circle className={"country-circle europe"} id="uk" cx="163" cy="210" fill="#FFA903" r="40" />
                <circle className={"country-circle europe"} id="sweden" cx="362" cy="126" fill="#FFA903" r="40" />
                <circle className={"country-circle europe"} id="spain" cx="156" cy="409" fill="#FFA903" r="40" />
                <circle className={"country-circle europe"} id="germany" cx="307" cy="241" fill="#FF9703" r="50" />
            </g>
        </svg>;

        return (
            <div className={"content-page " + cls}>
                <InteractiveSvgMap
                    svgImg={testMap}
                />
            </div>
        )
    }
}

const mapStateToProps = (state: IStoreState, ownProps): Partial<ContentPageProps> => {
    return {
        locale: state.app.locale
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage);
