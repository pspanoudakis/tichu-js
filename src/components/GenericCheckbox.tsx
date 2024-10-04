import { Component } from "react";

import styles from "../styles/Components.module.css"

export class GenericCheckbox extends Component<{
    text: string,
    callback: (s: boolean) => void
}> {

    state = {
        isChecked: true
    }

    toggleCheckStatus = () => {
        const newStatus = !this.state.isChecked
        this.setState({
            isChecked: newStatus
        }, () => this.props.callback(newStatus))
    }

    render() {
        return (
        <div className={styles.demoCheckboxContainer}>
            <input type={"checkbox"} defaultChecked={this.state.isChecked}
            className={styles.demoCheckbox} onChange={this.toggleCheckStatus}/>
            <span>{this.props.text}</span>
        </div>
        );
    }
}
