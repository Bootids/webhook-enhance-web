import React from "react"
import {browserHistory} from "../../components/base/History";
import store from "../../store/store";

class Wait extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            pending: true
        }
    }

    public componentDidMount(): void {
        store.subscribe(() => {
            const authorizedState = store.getState().authorizedState;
            this.setState({
                pending: authorizedState.pending
            });
        });
        let totalTime: number = 0;
        const interval = setInterval(() => {
            if (!this.state.pending) {
                clearInterval(interval);
                browserHistory.replace("/index")
            }
            totalTime += 300;
            if (totalTime === 6000) {
                clearInterval(interval);
                browserHistory.replace("/auth/login")
            }
        }, 500);
    }

    public render(): React.ReactNode {
        return <div/>;
    }

}

export default Wait
