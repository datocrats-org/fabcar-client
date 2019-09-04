import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class ChangeOwner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: this.props.match.params.key,
            owner: '',
            redirect: false,
            showLoading: true,
            car: {}
        }
    }

    onOwnerChanged(e) { this.setState({ owner: e.target.value }) }

    onFormSubmit(e) {
        e.preventDefault();
        this.setState({showLoading: true});
        axios.put('http://master:3000/cars', {
            key: this.state.key,
            owner: this.state.owner
        }).then(res => {
            this.setState({showLoading: false});
            if (res.data.status) {
                alert(res.data.message);
                this.setState({redirect: true})
            } else {
                alert(res.data.error.message)
            }
        }).catch(err => {
            this.setState({showLoading: false});
            alert('Something went wrong')
        });
    }

    componentDidMount() {
        axios.get('http://master:3000/cars/' + this.props.match.params.key).then(res => {
            this.setState({showLoading: false})
            if (res.data.status) {
                this.setState({car: res.data.car});
                console.log(this.state.car)
            } else {
                alert('Car ' + this.props.match.params.key + ' not found!');
                this.setState({redirect: true});
            }
        }).catch(err => {
            alert('Something went wrong')
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }

        const info = typeof this.state.car.owner !== 'undefined' ? <div className="row">
            <div className="col s12">
            <table className='striped responsive-table'>
                <tbody>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Key :</td><td>{this.state.key}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Make :</td><td>{this.state.car.make}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Model :</td><td>{this.state.car.model}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Color :</td><td>{this.state.car.color}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Old Owner :</td><td>{this.state.car.owner}</td></tr>                    
                </tbody>
            </table>
            </div>
        </div> : <h6>Loading old information...</h6>
        return (
            <div>
                <h4>Old Information</h4>
                {info}
                <h4>Change Owner</h4>
                <div className="row">
                    <form className="col s12" onSubmit={this.onFormSubmit.bind(this)}>
                        <div className="row">
                            <input disabled id="key" type="hidden" className="validate" value={this.state.key} />
                            <div className="input-field col s12">
                                <input id="owner" type="text" className="validate" value={this.state.owner} onChange={this.onOwnerChanged.bind(this)} />
                                <label htmlFor="owner">New Owner</label>
                            </div>
                        </div>
                        
                        <div className='row'>
                            <div className="input-field col s12">
                                <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                { this.state.showLoading ? <div className="progress"><div className="indeterminate"></div></div> : null}
            </div>
        )
    }
}