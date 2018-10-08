import React, { Component } from 'react';
import './App.css';
import Visualizer from './components/Visualizer';

class App extends Component {
    async getData() {
        const urls = [
            'http://assignment.quio.com/bonding',
            'http://assignment.quio.com/unbonding',
            'http://assignment.quio.com/injections',
            'http://assignment.quio.com/battery',
            'http://assignment.quio.com/temperature',
            'http://assignment.quio.com/errors'
        ];

        //fetches array of data
        const promises = urls.map(async url => {
            const res = await fetch(url);
            const resJson = await res.json();
            return {endpoint: url.match(/\/(\w+)$/)[1], result: resJson};
        });
    
        //retrieves data from promises
        let data = [];
        for(let prom of promises){
            await prom.then(x => {
                data.push(x);
            })
        }
        
        return data;
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>QuiO Data: Click one label below to toggle it from graph.</p>
                    <Visualizer data={this.getData()} />
                    <p>Adjust Slider above to filter the time series.</p>
                </header>
            </div>
        );
    }
}

export default App;
