import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import {Range, createSliderWithTooltip} from 'rc-slider';
import moment from 'moment';

import 'rc-slider/assets/index.css';

const RangeWithTooltip = createSliderWithTooltip(Range);

class Visualizer extends Component {
    constructor(props){
        super(props);
        this.state = {
            fullData: [],
            chartData: {labels:['QuiO'], datasets:[]},
        };
    }
    componentDidMount(){
        this.props.data.then(arrOfData => {
            let {fullData, chartData} = this.state;
            for(let data of arrOfData){
                let color = this.randomColor();
                fullData.push({
                    label: data.endpoint,
                    data: data.result.map(d => ({t: d.date, y: d.value})),
                    backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})`,
                    borderColor: `rgba(${color[0]},${color[1]},${color[2]}, 0.5)`,
                    lineTension: 0.2,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 2,
                });
            }
           chartData.datasets = fullData;
           this.setState({fullData, chartData});
        });
    }

    randomColor(){
        let blue = Math.floor(Math.random() * 256);
        let green = Math.floor(Math.random() * 256);
        let red = Math.abs(blue - green);
        return [red, green, blue];
    }

    updateGraphRange = (values) => {
        let {fullData, chartData} = this.state;
        
        for(let i = 0; i < fullData.length; i++){
            chartData.datasets[i].data = fullData[i].data.slice(values[0], values[1]+1);
        }
        this.setState({chartData});        
    }

    formatRangeTip = (value)=>{
        let today = new Date();
        let tip = new Date(today.getFullYear()-1, today.getMonth(), today.getDate()+value);
        return moment(tip).format('ll');
    }
    
    render(){
        return(
            <div>
                <Line 
                    data={this.state.chartData}
                    options={{
                        legend: {
                            labels: {
                                fontColor: '#CCC'
                            },
                            display: true
                        },
                        responsive: true,
                        scales: {
                            xAxes:[{
                                bounds: 'data',
                                distribution: 'series',
                                scaleLabel: {
                                    display: true,
                                    fontColor: '#CCC',
                                    labelString: 'Date'
                                },
                                ticks: {
                                    autoSkip: true,
                                    fontColor: '#CCC',
                                    maxTicksLimit: 20,
                                    source: 'data',
                                },
                                time: {
                                    unit: 'week'
                                },
                                type: 'time',
                            }],
                            yAxes:[{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Values',
                                    fontColor: '#CCC'
                                }
                            }],
                        },
                    }}
                    width={1000}
                    height={600}
                    
                />
                <RangeWithTooltip
                    min={0} 
                    max={365}
                    allowCross={false}
                    defaultValue={[0,365]}
                    onChange={this.updateGraphRange}
                    tipFormatter={this.formatRangeTip}
                />
            </div>
        );
    }
}

export default Visualizer;