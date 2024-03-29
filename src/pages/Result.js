import { Component } from "react";
import { PhysicsEvaluator, StatisticsEvluator } from "../services/evaluator";
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next';
import $ from 'jquery'
import { Entry } from "../components/Misc";
import { Button1 } from "../components/Buttons";
var dataPass = "", res = [];
function cleanSign(sign) {
    var bad = ["\\", "{", "}", "^", "*"];
    for (var b in bad) {
        b = bad[b];
        while (sign.indexOf(b) >= 0) {
            sign = sign.replace(b, "");
        }
    }
    return sign;
}
class Result extends Component {
    constructor(p) {
        super(p);
        dataPass = JSON.parse(atob(this.props.match.params.data));        
        var evalD;
        switch (this.props.match.params.reg) {
            case "statistics":
                evalD = new StatisticsEvluator();
                break;
            case "physics":
                evalD = new PhysicsEvaluator();
                break;
        }
        var r = evalD.evaluate(dataPass[0], dataPass[1]);
        res = r;
        this.state = r;
        console.log(r);
    }
    calculate() {

        var vec = [];
        for (var vv in res.variables) {
            vv = res.variables[vv];
            vec.push($(`#${cleanSign(vv.sign)}`).val());
        }
        $("#res").html(res.compute(vec))
    }

    componentDidMount() {
    }
    render() {
        return (
            <>

                <div>
                    <h1 class="text-center text-5xl m-10 tracking-widest">{this.state.name}</h1>
                </div>
                <div class="text-center">
                    <div class="flex mx-32">
                        <div class="text-center border rouded m-5 flex items-center justify-center w-1/3">
                            <Latex>{"$" + this.state.tex + "$"}</Latex>
                        </div>
                        <div class="w-2/3">
                            <h3 class="text-2xl border-b border-gray-600 py-2 m-2">Variables:</h3>
                            <ul>
                                {this.state.variables.map((v) => {
                                    return <h4><Latex>{ "$"+v.sign+"$" }</Latex> = { v.name}</h4>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="m-16">
                    <h3 class="text-2xl my-5">Compute</h3>
                    <div id="ins" class="mx-20 ">
                        <div class="flex">
                            <div>
                                {this.state.variables.map((v) => {
                                    return (
                                        <div class="m-5">
                                            <Entry type="number" placeholder={v.name} id={cleanSign(v.sign)}></Entry>
                                        </div>
                                    )
                                })}
                                <center>
                                    <Button1 Text="Calculate" onClick={this.calculate}></Button1>
                                </center>
                            </div>
                            <div class="mx-5 flex items-center justify-center" id="res">
                               
                            </div>
                        </div>
                    </div>
                </div>
              

                </>
            );
    }
}

export default Result