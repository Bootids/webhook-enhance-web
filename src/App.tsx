import 'nprogress'
import Editor from 'for-editor'
import 'nprogress/nprogress.css'
import * as React from 'react';
import "./assets/fonts/iconfont"
import './assets/fonts/iconfont.css'
import {Button} from "antd";


class App extends React.Component<any, any> {
    private editor: any;

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <div>
                <Button type={"primary"} htmlType={"button"} onClick={() => {
                    this.editor.insertContent("123")
                }}/>
                <Editor onRef={this.onRef.bind(this)} onChange={() => {
                    console.log("change")
                }}/>
            </div>
        );
    }

    private onRef(editor: any) {
        this.editor = editor
    }
}

export default App;