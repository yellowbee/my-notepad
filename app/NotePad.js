import React, { Component, PropTypes } from 'react';
import ReactDOM, {render} from 'react-dom';
import {ContentEditable} from 'react-contenteditable';

class NotePad extends Component {
    constructor() {
        super(...arguments) ;
        this.state = {
            html: '',
            value: ''
        };
    }

    componentDidMount() {
    }

    isPalindrome(str) {
        var left = 0;
        var right = str.length - 1;
        while (left < right) {
            if (str.charAt(left) != str.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }

        return true;
    }

    onChange(evt) {
        var value = evt.target.value;
        var modified_value = value.replace(/&nbsp;/g, ' ');
        if (modified_value[modified_value.length-1] != ' ') {
            var strs = modified_value.split(' ');
            var last = strs[strs.length-1];
            var len_last = last.length;
            var len_value = value.length;
            value = value.substring(0, len_value - len_last);
            value += '<mark>' + last + '</mark>';
        }

        //this.setState({html: value});
        this.state.html = value;
        this.forceUpdate();
    }

    matchHandler(match) {
        if (this.isPalindrome(match)) {
            return '<span>' + match + '</span>';
        }
        return match;
    }
    onTextareaChange(evt) {
        var value = evt.target.value;
        var strs = value.split(/\n/);
        if (strs[strs.length-1].length != 0 && strs[strs.length-1].length % 60 == 0) {
            value = value + '\n';
        }
        var text = value;
        text = text.replace(/\w+/g, this.matchHandler.bind(this));
        text = text.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
        this.setState({html: text, value: value});
    }
    onClear() {
        this.setState({html: '', value: ''});
    }
    onKeyDown(evt) {
        var value = evt.target.value;
        if (evt.keyCode === 8 && value.charAt(value.length-1) == '\n') {
            value = value.substring(0, value.length-1);
            var text = value;
            text = text.replace(/\w+/g, this.matchHandler.bind(this));
            text = text.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
            this.setState({html: text, value: value});
        }
    }
    onScroll(evt) {
        var scrollTop = ReactDOM.findDOMNode(this.refs.textarea).scrollTop;
        ReactDOM.findDOMNode(this.refs.content).scrollTop = scrollTop;
        this.forceUpdate();
    }
    render() {
        var ContentEditable = require("../node_modules/react-contenteditable/lib/react-contenteditable");
        let styleDiv = {margin: '100px auto', width: '550px', position: 'relative'};
        let styleContent = {
            color: 'transparent',
            height: '500px',
            width: '100%',
            overflowY: 'hidden',
        };
        let styleTextarea = {
                    position: 'absolute',
                    top: '-3px',
                    left: '-3px',
                    background: 'transparent',
                    height: '500px',
                    width: '100%'
        };
        return(
            <div style={styleDiv} onKeyDown={this.onKeyDown.bind(this)}>
                <ContentEditable
                    ref="content"
                    style={styleContent}
                    html={this.state.html}
                    disabled={false} />

                <textarea value={this.state.value}
                          ref="textarea"
                          onScroll={this.onScroll.bind(this)}
                          onChange={this.onTextareaChange.bind(this)}
                          style={styleTextarea}></textarea>
                <button onClick={this.onClear.bind(this)}>Clear</button>
            </div>
        )
    }
}

export default NotePad;
