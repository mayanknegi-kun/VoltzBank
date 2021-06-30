import React, { Component } from "react";
import {Tabs, Tab} from 'react-bootstrap';
import Token from "./contracts/Token.json"
import vBank from "./contracts/vBank.json";
import Web3 from "web3";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  
  async componentDidMount(){
    await this.loadBlockChainData(this.state.dispatch)
  }

  async loadBlockChainData(dispatch){
    if(window.ethereum){
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts();
      
      if(accounts[0]){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account:accounts[0],balance:balance,web3:web3})
      }
      try{
        const token = new web3.eth.Contract(Token.abi,Token.networks[netId].address);
        const vbank = new web3.eth.Contract(vBank.abi,vBank.networks[netId].address);
        // console.log(netId,vBank.networks[netId].address)
        const vBankAddress = vBank.networks[netId].address;
        this.setState({token:token,vBank:vbank,vBankAddress:vBankAddress})
      }catch(e){
        console.error("Error",e)
        alert("Contracts not deployed to current network.")
      }
      
    }
    else{
      window.alert("Please install MetaMask.")
    }
  }
  
  async deposit(amount){
    try{
    await this.state.vBank.methods.deposit().send({value:amount.toString(),from:this.state.account})
    }
    catch(e){
      console.log("Error,deposit: ",e)
    }
  }

  async withdrawl(e){
    e.preventDefault();
    if(this.state.vbank!="undefined"){
      try{
        await this.state.vBank.methods.withdraw().send({from:this.state.account})
      }catch(e){
        console.log("Error,withdraw: ",e)
      }
    }  
  }

  constructor(props){
    super(props)
    this.state ={
      web3:'undefined',
      account:'',
      token:null,
      vBank:null,
      balance:0,
      vBankAddress:null
    }
  }


  render() {
    return (
      <div className='text-monospace'>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="#"
          target="_blank"
        >
      <img src="#" className="App-logo" height="32"/>
        <b>VoltzBank</b>
      </a>
      </nav>
      <div className="container-fluid mt-5 text-center">
      <br></br>
        <h1>Welcome to VoltzBank</h1>
        <h2>{this.state.account}</h2>
        <br></br>
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab eventKey="deposit" title="Deposit">
                <div>
                  <br/>
                  How much you want to Deposit?
                  <br/>
                  <strong>Min. amount is 0.01 ETH</strong>
                  <br/>
                  (Only 1 deposit is possible at the time)
                  <br/>
                  <form className="my-3" onSubmit={e=>{
                    e.preventDefault()
                    let amount = this.depositAmount.value
                    amount = amount * 10**18;
                    this.deposit(amount)
                  }}>
                    <div className="form-group mr-sm-2">
                      <input
                      className="form-control form-control-md"                      
                      type="number"
                      step="0.01"
                      id="depositAmount"                  
                      placeholder="amount"
                      required
                      ref={(value)=>this.depositAmount=value}/>
                      <button type="submit" className='btn btn-primary'>DEPOSIT</button>
                    </div>
                  </form>
                </div>
              </Tab>
              <Tab eventKey="withdraw" title="Withdraw">
                <div>
                  <br/>
                  Do you want to withdraw along with interest?
                  <form onSubmit={e=>this.withdrawl(e)}>
                  <button type="submit" className='btn btn-primary'>Withdraw</button>
                  </form>
                </div>
              </Tab>
            </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
    )
  }
}

export default App;
