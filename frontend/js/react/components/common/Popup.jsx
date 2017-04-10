/**
 * Created by Vlasakh on 07.04.2017.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";


export class Popup extends React.PureComponent
{
    popup = null;

    constructor() {
        super();
    }


    render() {
        return (<noscript></noscript>);
    }


    componentDidMount()
    {
        this.renderPopup();
        $(this.popup).children().fadeIn(400);
    }


    componentDidUpdate()
    {
        this.renderPopup();
    }


    componentWillUnmount()
    {
        $(this.popup).children().fadeOut(200, () => {
            ReactDOM.unmountComponentAtNode(this.popup);
            document.body.removeChild(this.popup);
        });
    }


    renderPopup()
    {
        if (!this.popup)
        {
            this.popup = document.createElement("div");
            // this.popup.setAttribute("style", "display: none");
            document.body.appendChild(this.popup);
        }

        ReactDOM.render(
            <div className="dialog-win" data-js-popup-win="" /*style={{display: 'block'}}*/>
                <div className="dialog-win__container" onClick={(ee) => $(ee.target).data('js-wrapper') == 'wrapper' && this.props.closeFunc()} data-js-wrapper="wrapper">
                    <div className="dialog-win__content dialog-win__content_full">
                        <div className="dialog-win__close close" onClick={this.props.closeFunc}>{}</div>
                        <div className="dialog-win__inner" data-js-content="">
                            { this.props.children }
                        </div>
                    </div>
                </div>
            </div>

            /*<div className="popup-overlay">
                <div className="popup-content">
                    { this.props.children }
                </div>
            </div>*/,
            this.popup);
    }
}
